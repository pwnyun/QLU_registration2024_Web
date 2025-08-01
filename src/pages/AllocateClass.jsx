import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/modal.jsx'
import { request } from '../libs/request.js'
import { getLoginInfo } from '../libs/getLoginInfo.js'
import localforage from 'localforage'
import { PageFooter } from '../components/page-footer.jsx'

export default function AllocateClass() {
  const navigate = useNavigate()
  const [name, setName] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalButtonText, setModalButtonText] = useState('关闭')
  const [modalOptionalButton, setModalOptionalButton] = useState()

  const [classInformation, setClassInformation] = useState({})

  const [enableContractSharing, setEnableContractSharing] = useState(false)
  const [classmateInformation, setClassmateInformation] = useState([])

  // 检查是否已登录
  useEffect(() => {
    const fn = async () => {
      const userInfoRes = await getLoginInfo()
      if (userInfoRes.code !== 200) {
        console.error('allocate-class: getLoginInfo fail.')
        navigate('/')
        return
      }

      let { name } = userInfoRes
      setName(name)

      // 获取分班信息
      const classInfoRes = await request({
        url: '/api/class/get_class_info',
        method: 'GET',
      })

      console.log(classInfoRes)
      if (classInfoRes.code === 413) {
        localforage.clear()
        navigate('/login')
        return
      }

      if (classInfoRes.code !== 200) {
        setShowModal(true)
        setModalContent(`查询失败：${classInfoRes.msg}`)
        return
      }

      setClassInformation(classInfoRes.data)

      // 获取同班同学信息
      const classmatesRes = await request({
        url: '/api/class/get_classmates',
        method: 'GET',
      })

      if (classmatesRes.code === 200) {
        setEnableContractSharing(true)
        setClassmateInformation(classmatesRes.data)
      }

    }
    fn()
  }, [navigate])

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
          src="/assets/banner-compressed.png" />
        <img className="object-cover w-full h-[calc(100%-4px)]"
          src="/assets/index-bg-mask.svg" />
        <img
          className="object-cover translate-x-[-50%] h-[41.58%] absolute left-[50%] bottom-[12.3%] z-10"
          src="/assets/index-avatar-circle.svg" />
        <img
          className="object-cover translate-x-[-50%] h-[36.82%] absolute left-[50%] bottom-[15.5%] z-20"
          src="/assets/qlu-logo-space.png" />
        {/*<img*/}
        {/*  className="object-cover translate-x-[-50%] translate-y-[3px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px]"*/}
        {/*  src="images/index-title.svg"/>*/}
        <div
          className="object-cover translate-x-[-50%] translate-y-[20px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px] text-nowrap text-2xl flex flex-col justify-center items-center text-qlu font-bold">
          <div className="font-serif">齐鲁工业大学</div>
          <div className="font-serif">新生分班信息表</div>
        </div>
      </div>

      <div className={`p-4 ${enableContractSharing ? '' : 'pb-12 mb-12'}`}>
        <table className="mt-10 w-full">
          <tbody className="w-full">
            <tr className="w-full">
              <th
                className="border-y border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                scope="row">姓名
              </th>
              <td
                className="border-y border-gray-300 w-full">{name}</td>
            </tr>
            <tr className="w-full">
              <th
                className="border-b border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                scope="row">学号
              </th>
              <td
                className="border-b border-gray-300 w-full"></td>
            </tr>
            <tr className="w-full">
              <th
                className="border-b border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                scope="row">学部（院）
              </th>
              <td
                className="border-b border-gray-300 w-full">{classInformation?.department || <span className="text-gray-600">（暂无信息）</span>}</td>
            </tr>
            <tr className="w-full">
              <th
                className="border-b border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                scope="row">专业
              </th>
              <td
                className="border-b border-gray-300 w-full">{classInformation?.major || <span className="text-gray-600">（暂无信息）</span>}</td>
            </tr>
            <tr className="w-full">
              <th
                className="border-y border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                scope="row">班级
              </th>
              <td
                className="border-y border-gray-300 w-full">{classInformation?.class_name || <span className="text-gray-600">（暂无信息）</span>}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {enableContractSharing ? (
        <div className="p-4 w-full">
          <div>您已选择共享联系方式，下面是您同班同学的联系方式：</div>
          <table className="mt-4 w-full">
            <thead className="w-full">
              <tr className="w-full">
                <th
                  className="border-y border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                  scope="col">姓名
                </th>
                <th
                  className="border-y border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                  scope="col">学号
                </th>
                <th
                  className="border-y border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                  scope="col">手机号
                </th>
                <th
                  className="border-y border-gray-300 text-nowrap whitespace-nowrap sm:px-12 px-3 py-2"
                  scope="col">QQ号
                </th>
              </tr>
            </thead>
            <tbody className="w-full">
              {classmateInformation.map(classmate => (
                // todo: key 使用学号
                <tr className="w-full" key={classmate.name}>
                  <td className="border-b border-gray-300 text-center py-2 px-3">{classmate.name || <span className="text-gray-400">未共享</span>}</td>
                  <td className="border-b border-gray-300 text-center py-2 px-3"></td>
                  <td className="border-b border-gray-300 text-center py-2 px-3">{classmate.phone || <span className="text-gray-400">未共享</span>}</td>
                  <td className="border-b border-gray-300 text-center py-2 px-3">{classmate.qq || <span className="text-gray-400">未共享</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 flex">
          <div>您未选择向同班同学共享联系方式，同理您也无法看到同班同学的联系方式。</div>
        </div>
      )}

    </div>

    <PageFooter/>

    <Modal isOpen={showModal} setIsOpen={setShowModal}
      buttonText={modalButtonText}
      optionalButton={modalOptionalButton}>
      {modalContent}
    </Modal>
  </>)
}
