// import path from "path"
// import Image from "next/image"
import bg from "../../public/mp_background.jpg"


export default function Home() {
  return (
    <main>
      {/* <img src={bg.src} alt="" />
      <Image
        src={'/'}
        // className={styles.image}
        alt="image"
        layout="fill"
      /> */}
      <div
        className=""
        style={{
          background: `url(${bg.src})`,
          height: "100%"
        }}
      ></div>
      {/* <img src={bg} alt="" /> */}
    </main>
  )
}
