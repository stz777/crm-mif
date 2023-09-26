import bg from "../../public/mp_background.jpg"

export default function Home() {
  return (
    <main>
      <div
        className=""
        style={{
          background: `url(${bg.src})`,
          height: "100%"
        }}
      ></div>
    </main>
  )
}
