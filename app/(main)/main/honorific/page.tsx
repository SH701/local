"use client";

import HelperSlider from "@/components/etc/helperslider";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Image from "next/image"

export default function HonorificHelper() {
  const router = useRouter();

  return (
    <div className="p-6 rounded-lg max-w-lg mx-auto mt-6 flex flex-col">
      {/* 상단 헤더 */}
      <div className="flex items-center mb-6 px-4">
        <ChevronLeftIcon
          onClick={() => router.push("/main")}
          className="w-6 h-6 text-blue-500 cursor-pointer"
        />
        <h1 className="text-xl font-semibold ml-4">Honorific helper</h1>
      </div>

      {/* 입력 영역 */}
      <div className="bg-white rounded-2xl py-4 px-2 flex flex-col flex-1 mx-6 border border-gray-300">
        <textarea
          className="text-xl font-semibold placeholder:text-gray-400 resize-none w-full h-40"
          placeholder="Type in English..."
        />
        <HelperSlider />
        <div className=" mt-3 pt-3 border-t border-gray-300">
          <textarea
            className="text-xl font-semibold placeholder:text-gray-400 resize-none w-full h-20"
            placeholder="Korean translation..."
          />
        </div>
      </div>

      {/* Noonchi Coach */}
      <div className="bg-blue-50 p-4 rounded-lg mt-6 mx-4">
        <div className="flex gap-2 items-center">
          <Image src="/circle/circle4.png" alt="circle" width={28} height={28} />
          <h3 className="font-semibold text-blue-600">Noonchi Coach</h3>
        </div>
        <p className="text-sm mt-2">
          To your boss: <span className="font-semibold">Did you eat? → 점심 식사하셨나요?</span>
        </p>
        <p className="text-sm mt-2">
          To your parents: <span className="font-semibold">밥 먹었어요?</span> (polite yet warm)
        </p>
        <p className="text-sm mt-2">
          Keep it short and adapt politely to the situation!
        </p>
      </div>
    </div>
  );
}
