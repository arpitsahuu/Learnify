import Ratings from "../utils/Ratings";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";

type Props = {
  item: any;
};  

const SearchCard: FC<Props> = ({ item }) => {
  return (
    <Link 
      href={`/course/${item?._id}`}
    >
      <div className="w-full backdrop-blur border  border-[#00000015]  rounded-lg p-3 shadow-sm  hover:bg-gray-50 flex justify-between my-1 ">
        <h1 className="font-Poppins text-start text-xs sm:text-lg text-gray-700 flex items-center ">
        <FaSearch  id="searchicanbor" className=" inline-block text-sm mx-2 text-gray-500" />
          {item?.name}
        </h1>
        <h6 className="text-gray-600 text-sm ">{item?.level}</h6>
      </div>
    </Link>
  );
};

export default SearchCard;
