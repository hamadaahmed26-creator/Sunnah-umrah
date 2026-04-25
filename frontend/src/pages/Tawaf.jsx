import React from "react";
import Counter from "./Counter";
import { LangContext } from "../components/Layout";
import { useT } from "../lib/i18n";

export default function Tawaf() {
  const { lang } = React.useContext(LangContext);
  const t = useT(lang);
  return <Counter kind="tawaf" title={t("tawafCounter")} total={7} />;
}
