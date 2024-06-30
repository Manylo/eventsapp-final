"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import mongoose from 'mongoose';
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page(){
    const [choice, setChoice] = useState<string | null>(null);
    const router=useRouter();
    const {user}=useUser();
    const userId=user?.id;
    
    function activeChoice(event: React.MouseEvent<HTMLElement>): void {
        const target = event.target as HTMLElement;
        setChoice(target.id[6]); 
    }
    async function handleSubmit(){
        const response=await axios.post("../api/affectRole",{userId:userId,role:choice==="1" ? "organiser":"participant"});
        console.log(response.data);
        router.push("/");
        setTimeout(() => {
            window.location.reload();
          }, 2500);
    }
    return(
        <>
            <div className="my-5 ml-24 pl-6">
            <Link href="/" className="w-36">
                <Image 
                    src="/assets/images/logo.svg" width={128} height={38}
                    alt="Events#DZ logo" 
                />
            </Link>
            </div>
            <div className="choiceContainer">
                <h1>Join as an organizer or a participant</h1>
                <div className="choices">
                    <div className="choice" id="choice1" onClick={activeChoice}>
                        <input type="radio" checked={choice==="1"} />
                        <h1 id="choice1" onClick={activeChoice}>I'm an organiser,I need to organise an event</h1>
                    </div>
                    <div className="choice" id="choice2" onClick={activeChoice}>
                        <input type="radio" checked={choice==="2"} />
                        <h1 id="choice2" onClick={activeChoice}>I'm a participant, I want to attend an event</h1>
                    </div>
                </div>
                {choice ? <button className="activeButton" onClick={handleSubmit}>Join as a{choice==="1" ? "n organiser" : " participant"} </button> : <button className="inactiveButton" disabled>create account</button> }
            </div>
        </>
    )
}