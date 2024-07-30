import React, { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type userDetailsType =
  | {
    name: string;
    imageUrl: string;
    bio: string;
  }
  | undefined;

type ProfileProps = {
  userDetails: userDetailsType;
};

const Profile: FC<ProfileProps> = ({ userDetails }) => {
  return (
    <div className="flex h-[100%]">
      <Card className="border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>
            Your details which will be shown to every user.
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent className="gap-4 items-center flex ">
          <div className="flex flex-col gap-4 items-center">
            <Avatar className="w-[150px] h-[150px] cursor-pointer">
              <AvatarImage
                className="object-cover"
                src={`https://gateway.pinata.cloud/ipfs/${userDetails?.imageUrl}`}
              />

            </Avatar>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="h-full w-[10px] border-t" />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-medium leading-none">
                {userDetails?.name}
              </p>
            </div>
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="text-lg font-medium leading-none">
                {userDetails?.bio}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
