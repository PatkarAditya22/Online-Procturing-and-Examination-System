const common = require("oci-common");
const os = require("oci-objectstorage");
const fs = require("fs")

const configurationFilePath = "~/.oci/config";
const configProfile = "DEFAULT";

const provider = new common.ConfigFileAuthenticationDetailsProvider(
  configurationFilePath,
  configProfile
);

const client = new os.ObjectStorageClient({
    authenticationDetailsProvider: provider
});

client.region=common.Region.AP_MUMBAI_1;

const uploadToBucket = async (fileLocation,fileName) => {
    try {
      const request = {};
      const response = await client.getNamespace(request);
      const namespace = response.value;
      
      const getBucketRequest = {
        namespaceName: namespace,
        bucketName: "proctor-bucket"
      };

      const getBucketResponse = await client.getBucket(getBucketRequest);
      console.log("successful "+getBucketResponse.bucket);

      
      const stats = fs.statSync(fileLocation);
      const nodeFsBlob = new os.NodeFSBlob(fileLocation,stats.size);
      const objectData = await nodeFsBlob.getData();

      const putObjectRequest = {
        namespaceName: namespace,
        bucketName: "proctor-bucket",
        putObjectBody: objectData,
        objectName: fileName,
        contentLength: stats.size,
        contentType: "image/jpeg"
      };
      const putObjectResponse = await client.putObject(putObjectRequest);
      console.log("put object response = "+putObjectResponse);
      return {"success":putObjectResponse};
    }
    catch(err) {
        console.log(err);
        return {"error":err.message};
      
    }
};

module.exports = uploadToBucket;