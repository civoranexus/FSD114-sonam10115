import React from "react";
import { contactInfo, footerLists, socialIcons } from "../constant/data";

// import motion
import { motion } from "motion/react";
import * as variants from "../motion/animation";

const Footer = () => {
  return (
    <footer className="pt-14 pb-8  bg-white">
      <motion.div
        variants={variants.staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="container"
      >
        {/* footer top   */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_0.7fr_0.7fr_0.7fr">
          {/* footer brand  */}
          <motion.div variants={variants.fadeInUp}>
            {/* footer logo  */}
            <div className="">
              <img
                src="/images/logo.png"
                alt="footer "
                width={150}
                height={50}
              />
            </div>

            {/* link  */}
            <div className="mt-8 space-y-4">
              {contactInfo.map((item) => (
                <a
                  href="#"
                  key={item.id}
                  className="flex items-center gap-1.5 hover:text-orange-50
                             hover:underline transition-colors"
                >
                  {<item.icon />}
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* footer list  */}
          {footerLists.map((item) => (
            <motion.div
              variants={variants.fadeInUp}
              key={item.id}
              className="space-y-3"
            >
              <p className="text-lg font-semibold">{item.title}</p>
              <ul className="space-y-2.5">
                {item.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex hover:text-orange-50 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* social profile  */}
          <motion.div variants={variants.fadeInUp}>
            <p className="text-lg font-semibold"> social profiles </p>
            <div className="flex mt-5 gap-3">
              {socialIcons.map((icon) => (
                <button className="secondary-btn p-3.5 bg-white-97 hover:bg-white-99 hover:shadow-md transition-all">
                  <a href="">{<icon.icon />}</a>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
        {/* footer buttom  */}
        <motion.p
          variants={variants.fadeInUp}
          className="mt-16 text-center lg:mt-20"
        >
          &copy;{new Date().getFullYear()} Skillbridge. All rights reserved.
        </motion.p>
      </motion.div>
    </footer>
  );
};

export default Footer;
