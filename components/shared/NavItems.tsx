"use client";

import { headerLinksO, headerLinksP } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

const NavItems = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const userId = user?.id;
  const [role, setRole] = useState("");
  const headerLinks = role == "organiser" ? headerLinksO : headerLinksP;

  useEffect(() => {
    async function getUser() {
      try {
        if (userId) {
          const response = await axios.get(
            `/api/getUser/${user?.id as string}`
          );
          setRole(response.data.user.role);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, [userId, role]);
  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <li
            key={link.route}
            className={`${
              isActive && "text-primary-500"
            } flex-center p-medium-16 whitespace-nowrap`}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
