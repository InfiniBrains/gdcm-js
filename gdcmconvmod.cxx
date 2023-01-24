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
#include "gdcmJPEG2000Codec.h"
#include "gdcmJPEGCodec.h"
#include "gdcmJPEGLSCodec.h"
#include "gdcmPixmapReader.h"
#include "gdcmPixmapWriter.h"
#include "gdcmReader.h"
#include "gdcmSequenceOfFragments.h"
#include "gdcmSequenceOfItems.h"
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

struct SetSQToUndefined {
  void operator()(gdcm::DataElement &de) { de.SetVLToUndefined(); }
};

std::vector<uint8_t> decompressDicomBytes(std::vector<uint8_t> data) {
  return std::vector<uint8_t>();
}

std::vector<uint8_t> fileToBytes(const std::string& filepath){
  std::basic_ifstream<uint8_t> fin(filepath, std::ios::in |
                                                   std::ios::binary);
  if(!fin.is_open()) {
    std::cout << "File can not be opened: " << filepath << std::endl;
    abort();
  }

  auto buffer = std::vector<uint8_t>(std::istreambuf_iterator<uint8_t>(fin),
        std::istreambuf_iterator<uint8_t>());
  fin.close();
  return buffer;
}

void bytesToFile(std::vector<uint8_t> bytes, std::string filepath){
  std::ofstream fout(filepath, std::ios::out | std::ios::binary);
  if(!fout.is_open()) {
    std::cout << "File can not be opened: " << filepath << std::endl;
    abort();
  }
  fout.write(reinterpret_cast<const char*>(bytes.data()), bytes.size());
  fout.close();
}

int main(int argc, char *argv[]) {
  if (argc != 3) {
    std::cout << "Usage: gdcmconvmod input.dcm output.dcm" << std::endl;
    return 0;
  }

  std::string filename = argv[1];
  std::string outfilename = argv[2];

  if (filename.empty()) {
    std::cerr << "Need input file\n";
    return 1;
  }
  if (outfilename.empty()) {
    std::cerr << "Need output file\n";
    return 1;
  }

  // Debug is a little too verbose
  gdcm::Trace::SetDebug(false);
  gdcm::Trace::SetWarning(false);
  gdcm::Trace::SetError(false);

  gdcm::FileMetaInformation::SetSourceApplicationEntityTitle("gdcmconv");

  gdcm::PixmapReader reader;
  reader.SetFileName(filename.c_str());
  if (!reader.Read()) {
    std::cerr << "Could not read (pixmap): " << filename << std::endl;
    return 1;
  }
  gdcm::Pixmap &image = reader.GetPixmap();

  gdcm::ImageChangeTransferSyntax change;
  change.SetForce(true);
  change.SetCompressIconImage(false);

  const gdcm::TransferSyntax &ts = image.GetTransferSyntax();

  if (ts.IsExplicit()) {
    change.SetTransferSyntax(gdcm::TransferSyntax::ExplicitVRLittleEndian);
  } else {
    change.SetTransferSyntax(gdcm::TransferSyntax::ImplicitVRLittleEndian);
  }

  change.SetInput(image);

  bool b = change.Change();
  if (!b) {
    std::cerr << "Could not change the Transfer Syntax: " << filename
              << std::endl;
    return 1;
  }
  gdcm::PixmapWriter writer;
  writer.SetFileName(outfilename.c_str());
  writer.SetFile(reader.GetFile());

  gdcm::File &file = writer.GetFile();
  gdcm::FileMetaInformation &fmi = file.GetHeader();
//  fmi.Remove(
//      gdcm::Tag(0x0002, 0x0100)); //  '   '    ' // PrivateInformationCreatorUID
//  fmi.Remove(gdcm::Tag(0x0002, 0x0102)); //  '   '    ' // PrivateInformation

  const gdcm::Pixmap &pixout = change.PixmapToPixmapFilter::GetOutput();
  writer.SetPixmap(pixout);
  if (!writer.Write()) {
    std::cerr << "Failed to write: " << outfilename << std::endl;
    return 1;
  }

  std::cout << "Written: " << outfilename << std::endl;
  return 0;
}
