import {useNavigate} from "react-router-dom";
import "./Home.css";
import Modal from "../../modal.jsx";
import {forwardRef, useEffect, useRef, useState} from "react";
import {MdCheck, MdClose} from "react-icons/md";
import localforage from "localforage";
import {encrypt, getLoginInfo, request, validateIdCard} from "../../utils.js";
import {VscClose, VscScreenFull} from "react-icons/vsc";
import {TfiShareAlt} from "react-icons/tfi";

export default function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalButtonText, setModalButtonText] = useState("");
  const [modalOptionalButton, setModalOptionalButton] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const formRef = useRef(null);
  const [name, setName] = useState('')

  const showLoginModal = () => {
    setShowModal(true);
    setModalTitle("新生身份验证")

    // 检查是否到系统开放时间
    // if (new Date().getTime() < 1723651440000) {
    //   // TODO use time api
    //   setModalButtonText("关闭")
    //   setModalOptionalButton(null)
    //   setModalContent("系统将于 8 月 15 日开通。")
    //   return
    // }

    if (name) {
      // 已核验新生身份
      setModalContent(<>
        <div>当前已核验新生身份：{name}</div>
        <div
          className="underline my-2"
          onClick={localforage.clear().then(window.location.href = '/')}>
          不是我？点击取消核验
        </div>
      </>)
      setModalOptionalButton(<button
        type="button"
        className={`inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-sky-900 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-sky-950`}
        onClick={() => {
          setShowModal(false)
          checkAndLogin()
        }}
      >
        <MdCheck className="w-5 h-5 mr-1"/>新生预报到
      </button>)
      setModalButtonText(<><MdClose className="w-5 h-5 mr-1"/>关闭</>)

    } else {
      // 未核验新生身份
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
  }

  const checkAndLogin = () => {
    const formData = new FormData(formRef.current);
    const name = formData.get('name')?.trim();
    const idCard = formData.get('id_card')?.trim();

    if (!name) {
      setShowModal(true)
      setModalContent("姓名为空")
      setModalButtonText("关闭")
      setModalOptionalButton(null)
      return
    } else if (!validateIdCard(idCard)) {
      setShowModal(true)
      setModalContent("居民身份证号码校验失败。如您使用其他类型证件，请联系网络信息中心：0531-89631358。")
      setModalButtonText("关闭")
      setModalOptionalButton(null)
      return
    } else if (!formData.get('captcha')) {
      setShowModal(true)
      setModalContent("验证码为空。")
      setModalButtonText("关闭")
      setModalOptionalButton(null)
      return
    }

    formData.set('submit', '登录')

    request({
      url: '/api/login',
      method: 'POST',
      data: formData
    }).then(res => {
      if (res.data.status === 'success') {
        localforage.setItem("login_info",
          encrypt({name, idCard, token: res.data.token})
        ).then(r => {
          navigate('/directions')
        });
      } else {
        setShowModal(true)
        setModalContent(res.data.message)
        setModalButtonText("关闭")
        setModalOptionalButton(null)
      }
    })

  }

  const showWikiWindow = () => {
    setShowModal(true)
    setModalTitle("新生报到指南")
    setModalContent(<WikiWindow/>)
    setModalButtonText(<><VscClose className="w-6 h-6"/>&ensp;关闭</>)
    setModalOptionalButton(
      <a
        href="https://wlyw.qlu.edu.cn/wiki/help/"
        type="button"
        className={`inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 dark:bg-sky-900 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:bg-sky-950`}
      >
        <VscScreenFull className="w-6 h-6"/>&ensp;全屏阅读
      </a>)
  }

  // 检查是否已登录
  useEffect(() => {
    getLoginInfo().then(res => {
      if (res.status) {
        setName(res.name)
      }
    })
  }, []);

  return (
    <div id="homepage_main">
      <main className="font-sans flex min-h-screen flex-col items-center justify-between px-8 md:px-24 py-24">
        <div className="z-10 w-full max-w-5xl items-start justify-between text-sm lg:flex">
          <div
            className="fixed text-lg text-center lg:text-base left-0 top-0 flex w-full flex-col justify-center items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            <div>齐鲁工业大学<br/></div>
            <div><span className="font-mono px-1">2024</span>新生线上预报到</div>
          </div>
          <div
            className="fixed bottom-0 left-0 flex h-48 w-full lg:max-w-64 items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
            <div
              className="pointer-events-none flex flex-col place-items-center p-8 border-neutral-500 lg:pointer-events-auto lg:px-4 lg:py-2 lg:border-2 lg:rounded"
            >
              <div className="font-serif font-bold text-base py-1">反诈提示</div>
              <div className="indent-8">
                请广大新生关注
                <span
                  className="underline lg:decoration-wavy underline-offset-4 decoration-sky-500 dark:decoration-rose-400">录取通知书内指定的官方“公众号”“QQ群”</span>
                ，请勿自行搜索、加入或关注其他任何非官方建立的“QQ群”，不要在群内提交任何个人信息，谨防电信诈骗。
              </div>
            </div>
          </div>
        </div>

        <div
          className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
          <img
            className="relative block dark:drop-shadow-[0_0_0.3rem_#ffffff70] w-[180px] z-10"
            src="/assets/qlu-logo-solid-compressed.png"
            alt="齐鲁工大（鲁科院）Logo"
          />
          {/*<img*/}
          {/*  className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] w-[180px] sm:ml-[-16px]"*/}
          {/*  src="/assets/wlyw-logo-space.png"*/}
          {/*  alt="网络运维 Logo"*/}
          {/*/>*/}
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">

          <div
            className="group rounded-lg border border-transparent px-2 md:px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer select-none"
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
              8 月 15 日后，开启线上报到流程
            </p>
          </div>

          <div
            // to="https://wlyw.qlu.edu.cn/wiki/help/"
            className="group rounded-lg border border-transparent px-2 md:px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 cursor-pointer select-none"
            // target="_blank"
            // rel="noopener noreferrer"
            onClick={showWikiWindow}
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
          </div>

        </div>
      </main>

      <Modal isOpen={showModal} setIsOpen={setShowModal} title={modalTitle} buttonText={modalButtonText}
             optionalButton={modalOptionalButton}>
        {modalContent}
      </Modal>
    </div>
  )
}

const LoginForm = forwardRef(function LoginForm(props, ref) {
  return (<>
    <form ref={ref}>
      <div className="border-b border-gray-900/10 pt-4 pb-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1">

          <div className="sm:col-span-1">
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

          <div className="sm:col-span-1">
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

          <div className="sm:col-span-1">
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

function WikiWindow() {
  return (<>
    <iframe src="https://wlyw.qlu.edu.cn/wiki/help/"
            credentialless
            loading='lazy'
            className="w-full h-full min-h-96"
            sandbox="allow-downloads allow-modals allow-popups allow-scripts "
    ></iframe>
  </>)
}
