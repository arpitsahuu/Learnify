import Image from "next/image";

import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "../../../public/assests/avatar.png";
import {
  useEditProfileMutation,
  useUpdateAvatarMutation,
} from "../../Store/user/userApi";
import { useLoadUserQuery } from "../../Store/api/apiSlice";
import { toast } from "react-hot-toast";
import { styles } from "@/app/styles/style";

type Props = {
  avatar: string | null;
  user: any;
};

const ProfileInfo: FC<Props> = ({ avatar, user }) => {
  const [name, setName] = useState(user && user.name);
  const [updateAvatar, { isSuccess, error, isLoading:avatarLoading }] = useUpdateAvatarMutation();
  const [editProfile, { isSuccess: success, error: updateError , isLoading:infoLoading}] =
    useEditProfileMutation();
  const [loadUser, setLoadUser] = useState(false);
  const {} = useLoadUserQuery(undefined, { skip: loadUser ? false : true });

  const imageHandler = async (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        const avatar = fileReader.result;
        updateAvatar(avatar);
      }
    };
    fileReader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (isSuccess) {
      setLoadUser(true);
    }
    if (error || updateError) {
      console.log(error);
    }
    if(success){
      toast.success("Profile updated successfully!");
      setLoadUser(true);
    }
  }, [isSuccess, error,success, updateError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (name !== "") {
      await editProfile({
        name: name,
      });
    }
  };

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="relative">
          <Image
            src={user.avatar || avatar ? user.avatar.url || avatar : avatarIcon}
            alt=""
            width={120}
            height={120}
            className="w-[120px] h-[120px] cursor-pointer border-[3px] border-[#37a39a] rounded-full"
          />
          <input
            type="file"
            name=""
            id="avatar"
            className="hidden"
            onChange={imageHandler}
            accept="image/png,image/jpg,image/jpeg,image/webp"
          />
          <label htmlFor="avatar">
            <div className={`w-[30px] h-[30px] bg-slate-800 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer ${ avatarLoading && "!cursor-no-drop opacity-[0.6]"} `}>
              <AiOutlineCamera size={20} className="z-1 text-white" />
            </div>
          </label>
        </div>
      </div>
      <br />
      <br />
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={handleSubmit} className="flex flex-col justify-center w-full" >
          <div className="800px:w-[50%] m-auto block pb-4 w-full">
            <div className="w-[100%]">
              <label className="block pb-2">Full Name</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2">Email Address</label>
              <input
                type="text"
                readOnly
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                required
                value={user?.email}
              />
            </div>
            {/* <input
              className={`w-full m-auto sm:w-[250px] h-[40px] border border-[#37a39a] text-center bg-gray-100 text-black rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            /> */}
          </div>
            <button className={`w-60 m-auto sm:w-[250px] h-[40px] border border-[#37a39a] text-center bg-gray-100 text-black rounded-[3px] mt-8 cursor-pointer ${infoLoading && "!cursor-no-drop opacity-[0.6]"}`} type="submit">Update</button>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
