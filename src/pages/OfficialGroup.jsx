import { PageFooter } from '../components/page-footer.jsx'
import Modal from '../components/modal.jsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const contracts = [
  {
    name: '计算机科学与技术学部',
    person: '刘文龙',
    tel: '0531-89631255',
    qq_group: '1044692671',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjdFnic8Xw4OelOx8TyUH91hia9PpYw4ZpncHLiaxZ4nFgfjWZhbbuyoKYA/',
    url: 'https://qm.qq.com/q/rLU4HUyJUI',
  },
  {
    name: '轻工学部',
    person: '昝瑛瑛',
    tel: '0531-89632035',
    qq_group: '984904034',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjVbk6HibtyribHRcLVvsvGicZhKTXjdu1uXYOwEZDbNXvdaLan1BD5PkqQ/',
    url: 'https://qm.qq.com/q/yLSbNQChMI',
  },
  {
    name: '机械工程学部',
    person: '马静',
    tel: '0531-89631133',
    qq_group: '982528783',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjCx8kePNty1msDnACPWrTVp9XxC4FOdk8GvZddIp2T3lOW9kYMicly9g/',
    url: 'https://qm.qq.com/q/iByvSyfxfi',
  },
  {
    name: '电子电气与控制学部',
    person: '孙翔宇',
    tel: '0531-89631159',
    qq_group: '927822070',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjDqVVjdtamLl0BFnjpIPic26T2HMnGlPxNDol0QO6pVeIyKgGOeuvgOA/',
    url: 'https://qm.qq.com/q/rpgysdOHGE',
  },
  {
    name: '生物工程学部',
    person: '刘亚',
    tel: '0531-89631196',
    qq_group: '133429749',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjwZHj7CAFoROuzA6ZBMHVZABkfibTJF6lbCXAmo8KaicWBqGq75VsXnjQ/',
    url: 'https://qm.qq.com/q/4WxrFdWuxi',
  },
  {
    name: '食品科学与工程学部',
    person: '韩仲秋',
    tel: '0531-89631173',
    qq_group: '857479413',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjibIuiaUluIgrRBZceENGrRdZ2Z7JsAzsRG1haE8wlibia5diajkwbSPywbA/',
    url: 'https://qm.qq.com/q/xuAxY4XJuw',
  },
  {
    name: '环境科学与工程学部',
    person: '吕磊',
    tel: '0531-89631872',
    qq_group: '769495658',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjdRRWppxRvwW5SpYZhM0B6Bjp99Dy0C3iasfbnLVjDseSKf9T4b9icsKw/',
    url: 'https://qm.qq.com/q/qymbdYeiBi',
  },
  {
    name: '化学与制药学部',
    person: '任寰',
    tel: '0531-89631209',
    qq_group: '1054072724',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmj67vibf9Oiasic0SRUSZqztw8ExQhWJqUC5TGicMrXDXG9s0agDKnmjX1Uw/',
    url: 'https://qm.qq.com/q/utjwzuiqHY',
  },
  {
    name: '材料科学与工程学部',
    person: '姚彬',
    tel: '0531-89631228',
    qq_group: '957422161',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjKwTyjK96xsoMzIHXyH3aKDTvFY9SyiaTe7PlkRic27iat8ZEPNQWSd0jg/',
    url: 'https://qm.qq.com/q/QkyLhwDdK2',
  },
  {
    name: '数学与人工智能学部',
    person: '姚佳城',
    tel: '0531-89631269',
    qq_group: '600435175',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjy1vvp4fiaFzCERNJvtOwkmYg0Tsich1nDWEXkad4HzRUF4fRwh3glMicg/',
    url: 'https://qm.qq.com/q/q1YaiZPdPU',
  },
  {
    name: '光电科学与技术学部',
    person: '郭玉晶',
    tel: '0531-89631842',
    qq_group: '1041489350',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjtZ8S6yIiaQ3jIAaFhfm7cKd79z7s2mX7nbQCgRael64L6lQQNicgHagg/',
    url: 'https://qm.qq.com/q/LXSl3L3hiE',
  },
  {
    name: '能源与动力工程学部',
    person: '李彬',
    tel: '0531-89631846',
    qq_group: '1055803892',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjIztIIExr6b3S4Zdo1gN44ZD8Fbw7Ga7bnBqZAiaEibJZhQ3pDgZGich3Q/',
    url: 'https://qm.qq.com/q/FlzkD0tmKe',
  },
  {
    name: '海洋技术科学学部',
    person: '赵越',
    tel: '0531-89632080',
    qq_group: '927803477',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjvMbk9dtUozcv3tPN7MpX1gmoJhIO3C5wSZCP9uZ4Teqic7cLyibTg9gQ/',
    url: 'https://qm.qq.com/q/Um0B9nhC8O',
  },
  {
    name: '经济与管理学部',
    person: '刘征',
    tel: '0531-88631039',
    qq_group: '915472127',
    campus: '历城校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjuotFwp1rRZjmGqiaQiclsq4DrXRZy7nFAF3sr6bYueu2ogyn8V9o9FibA/',
    url: 'https://qm.qq.com/q/uinv4FHn3M',
  },
  {
    name: '艺术设计学院',
    person: '陈健',
    tel: '0531-89631189',
    qq_group: '379093726',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjz1zEvBdOicSpxEt7AIwJzq5icXFR4cvPW8mdDnkE84KQjxgTPOtObCWw/',
    url: 'https://qm.qq.com/q/IolWRajbUu',
  },
  {
    name: '政法学院',
    person: '杜哲',
    tel: '0531-88631023',
    qq_group: '971536484',
    campus: '历城校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjUuXfDzlHI0vibE0aPyIWy50XlyJ6b552oOT9rbvKxD5cggNPNEOibqbA/',
    url: 'https://qm.qq.com/q/dWZZswM0bm',
  },
  {
    name: '外国语学院（国际教育学院）',
    person: '宋歌',
    tel: '0531-89631262',
    qq_group: '585244761',
    campus: '历城校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmj8RrZiaPohZzyw1yxvDDWEDoJHyiaIHyZacdrI6e6RwwiaicLu2FfE9oXtA/',
    url: 'https://qm.qq.com/q/ikmqmyoYJa',
  },
  {
    name: '体育与音乐学院',
    person: '王荣雪',
    tel: '0531-89631360',
    qq_group: '1056533762',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjnLJPor41xcib7rRVSYOZ6m8btLIEtXVEJgatwibuEzYw3B58caGVeJCA/',
    url: 'https://qm.qq.com/q/KvbZaBADei',
  },
  {
    name: '基辅学院',
    person: '孙霞',
    tel: '0531-89631896',
    qq_group: '1053669634',
    campus: '长清校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmj8DY6d54Z6XSkoiawZLGaM2g7qNVn7feP034SsicicicSMqsZvAF1HbicQng/',
    url: 'https://qm.qq.com/q/1QjDIn0KO8',
  },
  {
    name: '菏泽校区（分院）',
    person: '崔玮',
    tel: '0530-7389655',
    qq_group: '194286399',
    campus: '菏泽校区',
    img: 'https://mmbiz.qpic.cn/mmbiz_png/72GLJ0cMfnafvUGLRf36dS1nGGnVXDmjJCeFLmU9IEw2IjoCY6V9hMVET4Gia9n71e9ibUrQSCaeGqlNkKv8Gb9g/',
    url: 'https://qm.qq.com/q/Gl36F9AqME',
  }]

export default function OfficialGroup () {
  const navigate = useNavigate()
  const [name, setName] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalButtonText, setModalButtonText] = useState('关闭')
  const [modalOptionalButton, setModalOptionalButton] = useState()

  return (<>
    <div className="container mx-auto max-w-[750px]">

      <div
        className="fixed mt-[620px] inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}>
        </div>
      </div>

      <div className="image-container relative mb-[20px] bg-no-repeat w-full">
        <img
          className="object-cover object-bottom w-full h-[calc(100%-2px)] absolute left-0 top-0 z-[-10]"
          src="/assets/banner-compressed.png"/>
        <img className="object-cover w-full h-[calc(100%-4px)]"
             src="/assets/index-bg-mask.svg"/>
        <img
          className="object-cover translate-x-[-50%] h-[41.58%] absolute left-[50%] bottom-[12.3%] z-10"
          src="/assets/index-avatar-circle.svg"/>
        <img
          className="object-cover translate-x-[-50%] h-[36.82%] absolute left-[50%] bottom-[15.5%] z-20"
          src="/assets/qlu-logo-space.png"/>
        {/*<img*/}
        {/*  className="object-cover translate-x-[-50%] translate-y-[3px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px]"*/}
        {/*  src="images/index-title.svg"/>*/}
        <div
          className="object-cover translate-x-[-50%] translate-y-[20px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px] text-nowrap text-2xl flex flex-col justify-center items-center text-qlu font-bold">
          <div className="font-serif">齐鲁工业大学</div>
          <div className="font-serif">官方新生群</div>
        </div>
      </div>

      <div className={`p-4 pb-12 mb-12`}>
        <div
          className="border rounded-lg border-gray-400/50 bg-white/30 backdrop-blur px-4 py-4 mx-4 mt-16 text-gray-700">
          <div
            className="text-xl underline underline-offset-8 decoration-pink-500 decoration-2 font-medium py-2">
            &ensp;注&emsp;意&ensp;
          </div>
          <div className="pt-2 text-center space-y-2">
            <p>近期，网络平台出现</p>
            <p>一批未经授权的社交群组</p>
            <p>如“表白墙”、“xx学部（院）学长/学姐”</p>
            <p>“xx学部（院）新生群”等</p>
            <p>这些账号和群组<b>擅自使用</b></p>
            <p>校（院）名称、校徽等标识</p>
            <p><b>发布不实信息、组织虚假宣传活动</b></p>
            <p>为维护校园网络环境安全，保障师生合法权益</p>
            <p>现发布 2025 级各学部（院）官方新生 QQ 群</p>
          </div>
        </div>

        <div className="mt-12 p-4 space-y-8">
          {contracts.map((item, index) => (
            <div key={index}
                 className="border rounded p-8 border-gray-400/50 bg-white/30 backdrop-blur"
            >
              <div
                className="text-xl underline underline-offset-8 decoration-sky-500 decoration-2 font-medium py-2">
                <span className="hidden sm:inline">&ensp;</span>{item.name}<span className="hidden sm:inline">&ensp;</span>
              </div>
              <p className="pt-2 sm:pt-1 sm:pl-8">团委/学工办负责人：<br className="sm:hidden"/>{item.person}</p>
              <p className="pt-2 sm:pt-1 sm:pl-8">办公电话：<br className="sm:hidden"/>{item.tel}</p>
              <p className="pt-2 sm:pt-1 sm:pl-8">新生报到校区：<br className="sm:hidden"/>{item.campus}</p>
              <p className="pt-2 sm:pt-1 sm:pl-8">新生QQ群号：<br className="sm:hidden"/><a href={item.url} className="underline text-teal-600">{item.qq_group}</a></p>
              <p className="pt-2 sm:pt-1 sm:pl-8">新生群二维码：<br className="sm:hidden"/><span className="text-gray-400">（使用手机 QQ 扫码）</span></p>
              <img
                src={item.img + '640?tp=webp'}
                referrerPolicy="no-referrer"
                loading="lazy"
                alt={item.url}
                className="max-h-72 sm:ml-8 border rounded"
              />
            </div>
          ))}
        </div>

        <a href="https://mp.weixin.qq.com/s/cR_Q3wuiXcBQN2VgYOFzCg"
           className="text-gray-400">
          转载自：齐鲁工业大学官方微信公众号
        </a>

      </div>

    </div>

    <PageFooter/>

    <Modal isOpen={showModal} setIsOpen={setShowModal}
           buttonText={modalButtonText}
           optionalButton={modalOptionalButton}>
      {modalContent}
    </Modal>
  </>)
}