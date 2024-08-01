import {Link, useNavigate} from "react-router-dom";
import "./Home.css";
import Modal from "../../modal.jsx";
import {forwardRef, useRef, useState} from "react";
import {MdCheck, MdClose} from "react-icons/md";
import localforage from "localforage";
import {encryptString, validateIdCard} from "../../utils.js";

export default function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalButtonText, setModalButtonText] = useState("");
  const [modalOptionalButton, setModalOptionalButton] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const formRef = useRef(null);

  const showLoginModal = () => {
    setShowModal(true);
    setModalTitle("新生身份验证")

    // 检查是否到系统开放时间
    // if (new Date().getTime() < 1723219200000) {
    //   // TODO use time api
    //   setModalButtonText("关闭")
    //   setModalOptionalButton(null)
    //   setModalContent("系统将于 8 月 10 日开通。")
    //   return
    // }

    setModalOptionalButton(<button
      type="button"
      className={`inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-sky-900 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-sky-950`}
      onClick={() => {
        setShowModal(false)
        checkAndLogin()
      }}
    >
      <MdCheck className="w-5 h-5 mr-1"/>验证
    </button>)
    setModalButtonText(<><MdClose className="w-5 h-5 mr-1"/>关闭</>)
    setModalContent(<LoginForm ref={formRef}/>)
  }

  const checkAndLogin = () => {
    const formData = new FormData(formRef.current);
    console.log("登录表单数据", formData)

    if (!validateIdCard(formData.get("id_card"))) {
      setShowModal(true)
      setModalContent("招生信息尚未就绪，8月15日后系统开放。")
      setModalButtonText("关闭")
      setModalOptionalButton(null)
      return
    }

    let res = true;
    if (res) {
      localforage.setItem("login_info", {
        name: encryptString("王宇哲"),
        id_card: encryptString("123456200001011239"),
        token: "TOKEN_FOR_SER VER_VALIDATE"
      }).then(r => {
        navigate('/directions')
      });
    }
  }

  return (
    <div id="homepage_main">
      <main className="font-sans flex min-h-screen flex-col items-center justify-between px-8 md:px-24 py-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
          <p
            className="fixed text-lg text-center lg:text-base left-0 top-0 flex w-full justify-center items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            齐鲁工业大学 <br/>
            2024 新生报到流程
          </p>
          <div
            className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="https://wlyw.qlu.edu.cn/"
              target="_blank"
              // rel="noopener noreferrer"
            >
              By 网络运维
            </a>
          </div>
        </div>

        <div
          className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <img
            className="relative hidden sm:block dark:drop-shadow-[0_0_0.3rem_#ffffff70] w-[180px] mr-[-16px] z-10"
            src="/assets/qlu-logo-space.png"
            alt="齐鲁工大（鲁科院）Logo"
          />
          <img
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] w-[180px] sm:ml-[-16px]"
            src="/assets/wlyw-logo-space.png"
            alt="网络运维 Logo"
          />
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">

          {/*<Function title="新生身份核验" content="请跟随流程完成身份核验" url="/login"/>*/}
          <button
            className="group rounded-lg border border-transparent px-2 md:px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            onClick={showLoginModal}
          >
            <h2 className="mb-3 text-2xl">
              {`新生身份核验 `}
              <span
                className="font-mono inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                {"->"}
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              8月15日后，验证身份后方可开启线上报到流程
            </p>
          </button>

          <Link
            to="https://wlyw.qlu.edu.cn/wiki/help/"
            className="group rounded-lg border border-transparent px-2 md:px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            // target="_blank"
            // rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl">
              {`新生报到指南 `}
              <span
                className="font-mono inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                {"->"}
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              了解齐鲁工大信息系统
            </p>
          </Link>

        </div>
      </main>

      <Modal isOpen={showModal} setIsOpen={setShowModal} title={modalTitle} buttonText={modalButtonText} optionalButton={modalOptionalButton}>
        {modalContent}
      </Modal>
    </div>
  )
}

const LoginForm = forwardRef(function LoginForm(props, ref) {
  return(<>
    <form ref={ref}>
      <div className="border-b border-gray-900/10 pt-4 pb-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">

          <div className="sm:col-span-3">
            <label htmlFor="name" className="block text-sm font-medium leading-6">
              姓名
            </label>
            <div className="mt-2 w-full">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="姓名"
                autoComplete="name"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="id_card" className="block text-sm font-medium leading-6">
              身份证号
            </label>
            <div className="mt-2 w-full">
              <input
                type="text"
                name="id_card"
                id="id_card"
                placeholder="身份证号"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="captcha" className="block text-sm font-medium leading-6">
              验证码
            </label>
            <div className="mt-2 w-full flex items-center gap-x-2">
              <img src="/api/captcha" className="bg-amber-500 w-auto h-full flex-grow text-nowrap" alt="验证码"
                onClick={e => {
                e.target.src = '/api/captcha?' + Math.random()
                }}
              />
              <input
                type="text"
                name="captcha"
                id="captcha"
                placeholder="验证码"
                className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

        </div>
      </div>
    </form>
  </>)
})
