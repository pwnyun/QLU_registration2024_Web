import { Link, useNavigate } from 'react-router-dom'
import { FaArrowRight, FaCheck } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import Modal from '../components/modal.jsx'
import { useImmer } from 'use-immer'
import { MdOutlineRemoveCircleOutline } from 'react-icons/md'

import useStatusStore from '../libs/statusStore.js'
import { request } from '../libs/request.js'
import { getLoginInfo } from '../libs/getLoginInfo.js'
import localforage from 'localforage'
import { PageFooter } from '../components/page-footer.jsx'

export default function Directions () {
  const navigate = useNavigate()
  const [loginInfo, setLoginInfo] = useImmer(
    { name: '', idCard: '', kid: '', token: '' })

  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalButtonText, setModalButtonText] = useState('关闭')
  const [modalOptionalButton, setModalOptionalButton] = useState(null)

  const { statuses, fetchStatus } = useStatusStore()

  const renderIcon = (status) => {
    switch (status) {
      case 'false':
        return <FaArrowRight className="absolute left-3 top-3 h-5 w-5 text-qlu"
                             aria-hidden="true"/>
      case 'disable':
        return <MdOutlineRemoveCircleOutline
          className="absolute left-3 top-3 h-5 w-5 text-stone-500"
          aria-hidden="true"/>
      case 'true':
        return <FaCheck className="absolute left-3 top-3 h-5 w-5 text-green-600"
                        aria-hidden="true"/>
    }
  }

  const updateReadStatus = async ({ id }) => {
    const response = await request({
      url: `/api/set_status`,
      method: 'POST',
      data: { [`${id}_status`]: true },
    })

    if (response.code !== 200) {
      setShowModal(true)
      setModalContent(`更新状态失败：${response.msg}`)
    }
  }

  const showDisableTip = () => {
    setShowModal(true)
    setModalContent('前面的区域以后再来探索吧。')
  }

  const [features, setFeatures] = useImmer([
    {
      name: '信息采集',
      description: '点击进入新生信息采集表单',
      finishDescription: '已采集，点击查看。',
      status: 'false',
      action: Link,
      url: '/collection-form',
      target: '_self',
      id: 'information_submit',
      event: () => { },
    }, {
      name: '一号通激活 & 人脸识别图片上传',
      description: '点击跳转到一号通激活指南',
      finishDescription: '已上传图片。',
      status: 'false',
      action: 'div',
      url: 'https://wlyw.qlu.edu.cn/wiki/2025yx/sso/',
      target: '_self',
      id: 'sso_registration',
      event: (e) => {
        updateReadStatus({ id: 'sso_registration' }).then(() => {
          window.location.href = 'https://wlyw.qlu.edu.cn/wiki/2025yx/sso/'
        })
      },
    }, {
      name: '线上缴费',
      description: '8 月 31 日后开启缴费流程。',
      finishDescription: '已查看。',
      status: 'disable',
      action: 'div',
      url: 'https://qlgydx.mp.sinojy.cn',
      target: '_self',
      id: 'read_bill',
      event: showDisableTip,
      // event: (e) => {
      //   updateReadStatus({ id: 'read_bill' }).then(() => {
      //     window.location.href = 'https://qlgydx.mp.sinojy.cn'
      //   })
      // },
    }, {
      name: 'OS 平台注册',
      description: '此步骤需分配学号后才能完成',// '点击跳转到工大OS激活指南',
      finishDescription: '已查看。',
      status: 'disable',
      action: 'div',
      url: 'https://wlyw.qlu.edu.cn/wiki/2025yx/os/',
      target: '_self',
      id: 'os',
      event: showDisableTip, //updateReadStatus
    }, {
      name: '宿舍查询',
      description: '点击查看宿舍分配信息',
      finishDescription: '已查询。',
      status: 'false',
      action: Link,
      url: '/allocate-dormitory',
      id: 'dormitory',
      event: () => {},
    }, {
      name: '分班信息查询',
      description: '点击查看分班信息',
      finishDescription: '已查看。',
      status: 'false',
      action: Link,
      url: '/allocate-class',
      id: 'allocate_class',
      event: () => { },
    }, {
      name: '预报到',
      description: '暂不开放',//'点击进入预报到系统',
      finishDescription: '已预报到。',
      status: 'disable',
      action: 'div', //Link,
      url: '/pre-check-in',
      target: '_self',
      id: 'pre_arrival',
      event: showDisableTip,
    },
  ])

  // 注册页面可见性监听 & 检查登录 & 获取状态
  useEffect(() => {
    const refreshStatus = () => {
      fetchStatus().catch(async (err) => {
        console.error('directions: fetchStatus failed.', err)
        if (err.code === 413) {
          await localforage.clear()
          navigate('/')
        } else {
          setShowModal(true)
          setModalContent(`获取已完成流程失败：${err.message || '未知错误'}`)
        }
      })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.debug('Page became visible, refreshing status.')
        refreshStatus()
      }
    }

    const handlePageShow = (event) => {
      if (event.persisted) {
        console.debug('Page restored from bfcache, refreshing status.')
        refreshStatus()
      }
    }

    // 首次加载时检查登录状态
    getLoginInfo().then(res => {
      if (res.code !== 200) {
        console.error('directions: getLoginInfo fail.', res.msg)
        if (res.code === 413) {
          localforage.clear().then(() => navigate('/'))
        }
        return
      }
      setLoginInfo(res)
      refreshStatus() // 获取状态
    }).catch(err => {
      console.error('directions: getLoginInfo failed during refresh.', err)
      localforage.clear().then(() => navigate('/'))
    })

    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [fetchStatus, navigate, setLoginInfo])

  // 当全局状态更新时，同步到本地的 features 状态
  useEffect(() => {
    setFeatures(draft => {
      for (const [key, value] of Object.entries(statuses)) {
        const index = draft.findIndex(
          feature => key === `${feature.id}_status`)
        if (index !== -1 && value === true && draft[index].status !==
          'disable') {
          draft[index].status = 'true'
        }
      }
    })

    // 如果人脸未上传，但 SSO 已阅读，则修正 SSO 提示文本
    if (!statuses.user_face_exists && statuses.sso_registration_status) {
      setFeatures(draft => {
        const index = draft.findIndex(
          feature => feature.id === 'sso_registration')
        if (index !== -1) {
          draft[index].status = 'false'
          draft[index].description = '人脸识别图片未上传'
          draft[index].finishDescription = '人脸识别图片未上传'
        }
      })
    }

    // 如果人脸已上传，但 SSO 未阅读，则修正 SSO 阅读状态
    if (statuses.user_face_exists && !statuses.sso_registration_status) {
      setFeatures(draft => {
        const index = draft.findIndex(
          feature => feature.id === 'sso_registration')
        if (index !== -1) {
          draft[index].status = 'true'
          updateReadStatus({ id: 'sso_registration' })
        }
      })
    }

  }, [statuses, setFeatures])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(statuses.kid);
    } catch (err) {
      console.error("Failed to copy kid:", err);
    }
  };

  return (<>
    <div
      className="overflow-hidden bg-white pt-12 pb-24 md:pt-16 md:pb-32 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">

          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2
                className="text-base font-semibold leading-7 text-qlu">齐鲁工业大学</h2>
              <p
                className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">线上报到流程</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {loginInfo.name}同学，您的考生号为{statuses.kid}，请遵循以下流程完成线上报到。
              </p>
              <PageImage className="block md:hidden w-full h-[50vw]"/>
              <dl
                className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">

                {features.map((feature) => (
                  <feature.action
                    key={feature.name}
                    to={feature.url}
                    target={feature.target}
                    onClick={() => feature.event({
                      id: feature.id,
                      loginInfo,
                      features: JSON.parse(JSON.stringify(features)),
                      feature,
                    })}
                    className="block relative py-2 pl-11 border rounded border-transparent hover:border-gray-300 select-none cursor-pointer"
                  >
                    <dt className="inline font-semibold text-gray-900">
                      {/*<feature.icon className="absolute left-3 top-3 h-5 w-5 text-qlu" aria-hidden="true"/>*/}
                      {renderIcon(feature.status)}
                      {feature.name}
                    </dt>
                    <br/>
                    <dd className="inline">
                      {feature.status === 'true'
                        ? feature.finishDescription
                        : feature.description}
                    </dd>
                  </feature.action>
                ))}

                <div
                  onClick={() => {
                    window.location.href = 'https://wlyw.qlu.edu.cn/wiki/wlyw/join/'
                  }}
                  className="block relative py-2 pl-2 border rounded border-gray-300 select-none cursor-pointer shadow-[0_0_20px_5px_rgba(212,212,212,0.7)] animate-pulse"
                >
                  <div className="flex space-x-2">
                    <img src="/assets/logo.png" alt="" className="w-12 h-12 mt-2 ml-2"/>
                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-900 leading-normal">
                        本系统由<br/>
                        齐鲁工业大学网络运维<br/>
                        强力驱动
                      </div>
                      <div>点击了解并加入我们</div>
                    </div>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          <PageImage
            className="w-[48rem] h-[28.46rem] hidden md:block sm:w-[57rem] md:-ml-4 lg:-ml-0"/>

        </div>
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

function PageImage ({ className, ...props }) {
  return (<img
    // src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
    src="/assets/banner-raw-compressed.png"
    alt="logo"
    // className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
    className={`object-cover object-left-top max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 w-[2432px] h-[1442px] ${className}`}
  />)
}