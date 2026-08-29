import type { PropsWithChildren, FC } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Histia — Fleets",
  description: "Fleet management",
};

const RootLayout: FC<PropsWithChildren> = ({ children }) => <>{children}</>;

export default RootLayout;