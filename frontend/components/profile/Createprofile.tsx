import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
} from "thirdweb";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { GoLinkExternal } from "react-icons/go";
import Link from "next/link";
import { useState } from "react";
import { ThetaTestnet } from "@/constants/Chains/ThetaTestnet";
import { ContractType } from "@/config/contracts.config";
import { toast } from "../ui/use-toast";

const Createprofile = () => {
  const [image, setImage] = useState<string>("");
  const [preview, setPreview] = useState<string | null>(null);

  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [imageIPFS, setImageIPFS] = useState("");

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkZTE5MWQ0Ny1iOTUyLTRhNDEtODhlMS1jMGMwOWU5YThlNzkiLCJlbWFpbCI6ImFiaGlzaGVrc2luZ2gyMzU3NkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYjI0ZTI3NWQyZWJiNDI5ZGM1MzYiLCJzY29wZWRLZXlTZWNyZXQiOiIwMDk0MzhmODYwOWFiZGJkMGM0ZTE2NGIxODE4NWM1OGM3YWIyNWQzZTc4NGUwZjE2MGExNzZiMTExYTg2ZGQ5IiwiZXhwIjoxNzUzNTQ1NzY1fQ.1ZU9_6OBRLsto0b3eTKHvbx44ble-hLp6Kpis8XfqD4";

  async function pinFileToIPFS() {
    try {
      if (!image) return;
      const file = image;
      const data = new FormData();
      data.append("file", file);

      const request = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
          body: data,
        }
      );
      const response = await request.json();
      console.log("Response >>>>>", response);
      if (response.IpfsHash) {
        setImageIPFS(response.IpfsHash);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const client = createThirdwebClient({
    clientId: "f71177f93907409fbad88c670442fbb8",
  });

  const contract = getContract({
    client,
    chain: ThetaTestnet,
    address: ContractType.CreatorContractAddress,
  });

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const handleCreateProfile = async (e: any) => {
    e.preventDefault();

    if (!name || !bio || !imageIPFS) return;

    const transaction = prepareContractCall({
      contract,
      method:
        "function registerCreator(string memory name, string memory imageUrl, string memory bio) public",
      params: [name, imageIPFS, bio],
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
    <div className="flex justify-center items-center">
      <Card className="border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            Make Creator&apos;s Profile
          </CardTitle>
          <CardDescription>
            You need to fill this up to create creator&apos;s Profile
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent className="grid gap-4 items-center">
          <div className="flex flex-col gap-4 items-center">
            <input
              id="upload-profile"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <Avatar className="w-[150px] h-[150px] cursor-pointer">
              <AvatarImage
                className="object-cover"
                src={preview ? preview : "https://github.com/shadcn.png"}
              />

              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {imageIPFS && (
              <Link
                href={`https://gateway.pinata.cloud/ipfs/${imageIPFS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg flex gap-2 items-center text-muted-foreground"
              >
                Uploaded to IPFS <GoLinkExternal />
              </Link>
            )}

            {image ? (
              <Button disabled={!!imageIPFS} onClick={pinFileToIPFS}>
                {imageIPFS ? "Uploaded" : "Upload Image"}
              </Button>
            ) : (
              <Button>
                <Label className="cursor-pointer" htmlFor="upload-profile">
                  Browse Image
                </Label>
              </Button>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="Name">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="Name"
              type="Name"
              placeholder="Enter Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              id="bio"
              placeholder="Enter small bio"
              className="resize-none"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateProfile} className="w-full">
            {isPending ? "Creating..." : "Create Profile"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Createprofile;
