import React from "react";

// import motion

import { motion } from "motion/react";
import * as variants from "../../../motion/animation";

const Title = ({ title, text, link }) => {
  return (
    <div
      className="flex items-center justify-between flex-wrap
    gap-4"
    >
      <div>
        <motion.h2
          variants={variants.fadeInUp}
          className="text-3xl md:text-4xl font-bold"
        >
          {title}
        </motion.h2>
        <motion.p
          variants={variants.fadeInUp}
          className="max-w-[630px] mt-4 mb-5 text-lg md:text-xl text-gray-600  "
        >
          {text}
        </motion.p>
      </div>
      <motion.button variants={variants.fadeInUp} className="secondary-btn">
        {link}
      </motion.button>
    </div>
  );
};

export default Title;
