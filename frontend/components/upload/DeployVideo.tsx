import { ContractType } from "@/config/contracts.config";
import { ThetaTestnet } from "@/constants/Chains/ThetaTestnet";
import React, { useContext } from "react";
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
} from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { UploadContext } from "./UploadContext";
import ethers from "ethers";
import { toast } from "../ui/use-toast";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const DeployVideo = () => {
  const client = createThirdwebClient({
    clientId: "f71177f93907409fbad88c670442fbb8",
  });

  const {
    form,
    previewVideoId,
    videoId,
    videoSrc,
    previewVideoSrc,
  } = useContext(UploadContext);

  const [title, description, price] = form.getValues([
    "title",
    "description",
    "price",
  ]);

  const { mutate: sendTransaction, isPending } = useSendTransaction();
  const contract = getContract({
    client,
    chain: ThetaTestnet,
    address: ContractType.VideoNFTAddress,
  });

  const handleDeployVideo = () => {
    // https://gateway.pinata.cloud/ipfs/QmcbfwxSVisSw81xQnhSR9kFiJxAeFjn3hpDW6UYwyYEUw

    const videoPrice = ethers.parseUnits(price.toString(), 18);

    const transaction = prepareContractCall({
      contract,
      method:
        "function mintVideoNFT(address creator,string memory tokenURI,string memory title,string memory description,string memory previewVideoUrl,string memory videoUrl,uint256 price) public returns (uint256)",
      params: [
        "0x9452BCAf507CD6547574b78B810a723d8868C85a",
        "QmXhidwggZMvnwEyixX8smBWmrciWiGKsT7iYwVG3yLGxm",
        title,
        description,
        previewVideoId,
        videoId,
        videoPrice,
      ],
    });

    sendTransaction(transaction, {
      onSuccess: () => {
        toast({
          title: "Transaction Successful",
          description: "You have successfully created creator's profile.",
        });
      },
      onError: (error) => {
        console.log("Error >>>", error);

        toast({
          variant: "destructive",
          title: "Transaction Failed",
          description: "Transaction Failed. Try again later.",
        });
      },
    });
  };

  return (
    <>
      <Card className="max-w-[450px]">
        <CardHeader>
          <CardTitle>Deploy Video</CardTitle>
          <CardDescription>
            Deploy Your video to our contracts and earn rewards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 mt-8">
          {previewVideoSrc && (
            <div>
              <p className="text-lg font-medium leading-none">Preview Video</p>
              <div className="w-[400px] m-auto">
                <video controls>
                  <source src={previewVideoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}

          {videoSrc && (
            <div>
              <p className="text-lg font-medium leading-none">Video</p>
              <div className="w-[400px] m-auto">
                <video controls>
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleDeployVideo}
            className="flex items-center justify-center"
          >
            Deploy Video
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default DeployVideo;
