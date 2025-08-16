import Logo from "@/components/etc/logo";

export default function Loading(){
    return(
        <div className="flex flex-col gap-2 items-center justify-center mt-76">
            <span className="text-2xl">Welcome!</span>
            <span className="text-gray-300">Loading your Noonchi Coach</span>
            <Logo/>
        </div>
    )
}