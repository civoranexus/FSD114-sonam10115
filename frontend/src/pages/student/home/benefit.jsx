import React from "react";
import Title from "./Title";
import { benefitItems } from "../../constant/data.js";
import { RiArrowRightUpLine } from "@remixicon/react";

// import motion

import { motion } from "motion/react";
import * as variants from "../../../motion/animation";

const StudentBenefitPage = () => {
  return (
    <section className=".section">
      <motion.div
        variants={variants.staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container"
      >
        {/* title  */}
        <Title
          title="Benefits"
          text="lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam eget elit id imperdiet et. Cras eu sit dignissim lorem nibh et. Ac cum eget habitasse in velit fringilla feugiat senectus in."
          link="view All"
        />

        {/* card wrapper  */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:mt-16">
          {benefitItems.map((item) => (
            // card
            <motion.div
              variants={variants.fadeInUp}
              className=" bg-[#F4F7FA] p-10 flex flex-col rounded-xl "
            >
              {/* // icon */}
              <div
                className="bg-[#1B9AAA] w-[55%] h-24 flex items-center justify-center mx-auto rounded-x47
              +47
              l mb-7"
              >
                <img src={item.icon} alt={item.title} width={64} height={64} />
              </div>
              {/* content  */}
              <div className="mb-4 text-center space-y-3.5 ">
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>

              {/* button  */}
              <button className="mt-auto ml-auto border border-[#FFFFFF] w-14 h-14 flex items-center justify-center rounded-md text-black transition-colors hover:bg-[#142C52] hover:text-white">
                <RiArrowRightUpLine size={26} />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StudentBenefitPage;
