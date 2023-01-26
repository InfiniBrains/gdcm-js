// This is a simplified version from gdcmconv to just decompress see the
// original gdcmconv for more details
// it expects two files

#include "gdcmAnonymizer.h"
#include "gdcmAttribute.h"
#include "gdcmDataSet.h"
#include "gdcmFileDecompressLookupTable.h"
#include "gdcmFileDerivation.h"
#include "gdcmFileExplicitFilter.h"
#include "gdcmFileMetaInformation.h"
#include "gdcmIconImageGenerator.h"
#include "gdcmImage.h"
#include "gdcmImageApplyLookupTable.h"
#include "gdcmImageChangePhotometricInterpretation.h"
#include "gdcmImageChangePlanarConfiguration.h"
#include "gdcmImageChangeTransferSyntax.h"
#include "gdcmImageFragmentSplitter.h"
#include "gdcmImageReader.h"
#include "gdcmJPEG2000Codec.h"
#include "gdcmJPEGCodec.h"
#include "gdcmJPEGLSCodec.h"
#include "gdcmPixmapReader.h"
#include "gdcmPixmapWriter.h"
#include "gdcmReader.h"
#include "gdcmSequenceOfFragments.h"
#include "gdcmSequenceOfItems.h"
#include "gdcmStreamImageReader.h"
#include "gdcmSystem.h"
#include "gdcmUIDGenerator.h"
#include "gdcmVersion.h"
#include "gdcmWriter.h"

#include <iostream>
#include <string>
#include <vector>

#include <getopt.h>
#include <stdio.h>  /* for printf */
#include <stdlib.h> /* for exit */
#include <string.h>
#include <fstream>
#include <sstream>

//std::vector<uint8_t> fileToBytes(const std::string& filepath){
//  std::basic_ifstream<uint8_t> fin(filepath, std::ios::in |
//                                                   std::ios::binary);
//  if(!fin.is_open()) {
//    std::cout << "File can not be opened: " << filepath << std::endl;
//    abort();
//  }
//
//  auto buffer = std::vector<uint8_t>(std::istreambuf_iterator<uint8_t>(fin),
//        std::istreambuf_iterator<uint8_t>());
//  fin.close();
//  return buffer;
//}

//void bytesToFile(std::vector<char> bytes, std::string filepath){
//  std::ofstream fout(filepath, std::ios::out | std::ios::binary);
//  if(!fout.is_open()) {
//    std::cout << "File can not be opened: " << filepath << std::endl;
//    abort();
//  }
//  fout.write(bytes.data(), bytes.size());
//  fout.close();
//}

std::vector<char> decompressDicomBytes(std::vector<char> data) {
  // Debug is a little too verbose
  gdcm::Trace::SetDebug(false);
  gdcm::Trace::SetWarning(false);
  gdcm::Trace::SetError(false);

  gdcm::FileMetaInformation::SetSourceApplicationEntityTitle("gdcmconv");

  // convert bytes into stream
  std::stringstream si;
  si.rdbuf()->pubsetbuf(reinterpret_cast<char*>(&data[0]), data.size());

  // read file
  gdcm::File inputFile;
  inputFile.Read(si);
  auto& header = inputFile.GetHeader();
  auto& dataset = inputFile.GetDataSet();

  gdcm::PixmapReader reader;
  reader.SetFile(inputFile);

  // try read
  if (!reader.Read()) {
    std::cerr << "Could not read" << std::endl;
    return {};
  }

  gdcm::Pixmap &pixmap = reader.GetPixmap();

  gdcm::ImageChangeTransferSyntax change;
  change.SetForce(true);
  change.SetCompressIconImage(false);

  const gdcm::TransferSyntax &ts = pixmap.GetTransferSyntax();

  if (ts.IsExplicit()) {
    change.SetTransferSyntax(gdcm::TransferSyntax::ExplicitVRLittleEndian);
  } else {
    change.SetTransferSyntax(gdcm::TransferSyntax::ImplicitVRLittleEndian);
  }

  change.SetInput(pixmap);

  if (!change.Change()) {
    std::cerr << "Could not change the Transfer Syntax" << std::endl;
    return {};
  }

  gdcm::PixmapWriter writer;
  writer.SetFile(reader.GetFile());

  gdcm::File &outFile = writer.GetFile();

  const gdcm::Pixmap &pixout = change.PixmapToPixmapFilter::GetOutput();
  writer.SetPixmap(pixout);

  std::stringstream so;
  writer.SetStream(so);

  if (!writer.Write()) {
    std::cerr << "Failed to write" << std::endl;
    return {};
  }

  std::cout << "Written" << std::endl;
  auto str = so.str();
  std::vector<char> ret(str.begin(), str.end());
  return ret;
}
