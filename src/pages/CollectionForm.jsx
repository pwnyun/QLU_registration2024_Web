import level from '@province-city-china/level'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateIdCard } from '../libs/utils.js'
import { TfiClose, TfiShareAlt } from 'react-icons/tfi'
import Modal from '../components/modal.jsx'
import { names as ethnicList } from 'gb3304'
import ComboBox from '../components/combo-box.jsx'
import { request } from '../libs/request.js'
import { getLoginInfo } from '../libs/getLoginInfo.js'
import localforage from 'localforage'
import useStatusStore from '../libs/statusStore.js'
import { Switch } from '@headlessui/react'
import { PageFooter } from '../components/page-footer.jsx'

export default function CollectionForm () {
  const navigate = useNavigate()

  const formRef = useRef(null)
  const [name, setName] = useState('')
  const [idCard, setIdCard] = useState('')
  const [token, setToken] = useState('')
  const [province, setProvince] = useState('')
  const [provinceIndex, setProvinceIndex] = useState(-1)
  const [prefecture, setPrefecture] = useState('')
  const [prefectureIndex, setPrefectureIndex] = useState(-1)
  const [county, setCounty] = useState('')
  const [networkApply, setNetworkApply] = useState(true)

  const [contactSharingOptions, setContactSharingOptions] = useState({
    roommate: { sharePhone: false, shareQq: false },
    classmate: { sharePhone: false, shareQq: false },
  })

  const { statuses } = useStatusStore()
  const [hasFinishedForm, setHasFinishedForm] = useState(
    statuses.information_submit_status?.toString() === 'true')

  // 简单表单数据 - 不需要额外处理，只需要读取写入即可。
  const [formData, setFormData] = useState({
    gender: '',
    ethnic: '',
    phone: '',
    qq: '',
    guardianName: '',
    guardianPhone: '',
    address: '',
    height: '',
    weight: '',
    blood: '',
    studentLoan: '',
    militaryDischarged: '',
    militaryIntention: '',
    militaryTime: '',
    campusNetwork: '',
  })

  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalButtonText, setModalButtonText] = useState('关闭')
  const [modalOptionalButton, setModalOptionalButton] = useState()

  const [jumpButton] = useState(
    <button type="button"
            className={`inline-flex justify-center items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
            onClick={() => {
              setShowModal(false)
              navigate('/directions')
            }}>
      <TfiShareAlt/>&ensp;返回
    </button>,
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSharingChange = (group, type, value) => {
    setContactSharingOptions(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [type]: value,
      },
    }))
  }

  // 检查是否已登录 & 加载历史表单
  useEffect(() => {
    async function fn () {
      const res = await getLoginInfo()

      if (res.code !== 200) {
        console.error('collection-form: getLoginInfo fail.')
        navigate('/')
      }

      const { name, idCard, token } = res
      setName(name)
      setIdCard(idCard)
      setToken(token)

      const historyResponse = await request({
        url: '/api/information_submit/get',
        method: 'GET',
      })

      if (historyResponse.code === 200 && historyResponse.data) {
        const data = historyResponse.data
        // 1. 填充普通表单项
        setFormData({
          gender: data.gender || '',
          ethnic: data.ethnic || '',
          phone: data.phone || '',
          qq: data.qq || '',
          guardianName: data.guardianName || '',
          guardianPhone: data.guardianPhone || '',
          address: data.address || '',
          height: String(Number(data.height) || ''),
          weight: String(Number(data.weight) || ''),
          blood: data.blood || '',
          studentLoan: data.studentLoan || '',
          militaryDischarged: data.militaryDischarged || '',
          militaryIntention: data.militaryIntention || '',
          militaryTime: data.militaryTime || '',
          campusNetwork: data.campusNetwork || '',
        })
        // 新增：初始化多选状态
        if (data.campusNetwork) {
          const arr = data.campusNetwork.split(',')
          setCampusNetworkSelections([
            arr[0] || null,
            arr[1] || null,
            arr[2] || null,
          ])
        }

        // 2. 填充特殊状态
        setNetworkApply([true, 1, '1', 'true'].includes(data.networkApply))

        // 3. 填充级联地址
        if (data.province) {
          const provIndex = level.findIndex(item => item.name === data.province)
          if (provIndex > -1) {
            setProvince(data.province)
            setProvinceIndex(provIndex)
            if (data.prefecture) {
              const prefIndex = level[provIndex]?.children?.findIndex(
                item => item.name === data.prefecture) ?? -1
              if (prefIndex > -1) {
                setPrefecture(data.prefecture)
                setPrefectureIndex(prefIndex)
                if (data.county) {
                  setCounty(data.county)
                }
              }
            }
          }
        }

        // 4. setHasFinishedForm - 判定优先级高于 `/api/status` 状态接口
        setHasFinishedForm(true)
      } else if (historyResponse.code === 413) {
        await localforage.clear()
        navigate('/')
      } else if (historyResponse.code === 401 &&
        historyResponse.msg === '未找到学生信息') {
        // ignored
      } else {
        setShowModal(true)
        setModalContent(`读取历史填写表单失败：` + historyResponse.msg)
      }

      const sharingResponse = await request({
        url: '/api/contact_sharing/get',
        method: 'GET',
      })

      if (sharingResponse.code === 200 && sharingResponse.data) {
        const {
          share_phone_with_roommate,
          share_qq_with_roommate,
          share_phone_with_classmate,
          share_qq_with_classmate,
        } = sharingResponse.data
        setContactSharingOptions({
          roommate: {
            sharePhone: !!share_phone_with_roommate,
            shareQq: !!share_qq_with_roommate,
          },
          classmate: {
            sharePhone: !!share_phone_with_classmate,
            shareQq: !!share_qq_with_classmate,
          },
        })
      } else if (sharingResponse.code !== 401) {
        console.warn('Could not load contact sharing preferences:',
          sharingResponse.msg)
      }
    }

    fn()
  }, [])

  const [campusNetworkSelections, setCampusNetworkSelections] = useState(
    [null, null, null])

  const handleCampusNetworkChange = (index, checked, value) => {
    setCampusNetworkSelections(prev => {
      const newArr = [...prev]
      newArr[index] = checked ? value : null
      return newArr
    })
  }

  const submit = () => {
    let errorMessage = ''

    if (!validateIdCard(idCard)) {
      errorMessage += '居民身份证号码校验有误，请确认新生身份核验通过，如有疑问请联系网络信息中心：0531-89631358；'
    }
    if (!formData.gender) {
      errorMessage += '请选择性别；'
    }
    if (!formData.ethnic) {
      errorMessage += '请选择民族；'
    }
    if (!formData.phone || formData.phone.trim().length !== 11 ||
      isNaN(Number(formData.phone.trim()))) {
      errorMessage += '个人联系电话输入有误（可能不为 11 位或输入了非数字字符）；'
    }
    if (!formData.qq || isNaN(Number(formData.qq.trim()))) {
      errorMessage += '个人 QQ 号输入有误（可能输入了非数字字符）；'
    }
    if (!formData.guardianName) {
      errorMessage += '请输入监护人姓名；'
    }
    if (!formData.guardianPhone ||
      formData.guardianPhone.trim().length !== 11 ||
      isNaN(Number(formData.guardianPhone.trim()))) {
      errorMessage += '监护人联系电话输入有误（可能不为 11 位或输入了非数字字符）；'
    }
    if (!province || provinceIndex < 0) {
      errorMessage += '请选择省份；'
    }
    if (province !== '台湾省' && (!prefecture || prefectureIndex < 0)) {
      errorMessage += '请选择地级市；'
    }

    if ([
        '台湾省',
        '香港特别行政区',
        '澳门特别行政区',
        '北京市',
        '天津市',
        '上海市',
        '重庆市',
        '广东省',
        '海南省'].filter(item => item === province).length === 0
      && (!county)
    ) {
      errorMessage += '请选择县级市；'
    }
    if (!formData.address) {
      errorMessage += '详细地址不能位空；'
    }

    let shadowNetworkApply = networkApply;
    let shadowCampusNetworkSelections = JSON.parse(JSON.stringify(campusNetworkSelections))

    if (shadowNetworkApply) {
      if (!campusNetworkSelections.some(v => v)) { // 什么都不选
        shadowNetworkApply = false
        shadowCampusNetworkSelections = ['济南移动', null, null]
        // errorMessage += '您选择了开通融合校园网，请至少选择一个运营商；'
      }
    } else {
      shadowCampusNetworkSelections = [null, null, null]
    }

    if (errorMessage !== '') {
      setShowModal(true)
      setModalContent(`${errorMessage}请检查输入。`)
      setModalButtonText('确认')
      setModalOptionalButton(null)
      return
    }

    // 新增：提交前将多选转为字符串
    const campusNetworkStr = shadowCampusNetworkSelections.
        map(v => v || 'null').
        join(',')
    const submissionData = {
      ...formData,
      province,
      prefecture,
      county,
      networkApply: shadowNetworkApply,
      campusNetwork: campusNetworkStr,
    }

    request({
      method: 'POST',
      url: hasFinishedForm
        ? '/api/information_submit/modify'
        : '/api/information_submit/apply',
      data: submissionData,
    }).then(res => {
      setShowModal(true)
      setModalContent(res.msg)

      if (res.code === 200) {
        // 提交是否共享信息
        request({
          method: 'POST',
          url: '/api/class/agree_share',
          data: {
            share_phone_with_roommate: contactSharingOptions.roommate.sharePhone,
            share_qq_with_roommate: contactSharingOptions.roommate.shareQq,
            share_phone_with_classmate: contactSharingOptions.classmate.sharePhone,
            share_qq_with_classmate: contactSharingOptions.classmate.shareQq,
          },
        }).then(sharingRes => {
          if (sharingRes.code !== 200) {
            console.error('Failed to update contact sharing preferences:',
              sharingRes.msg)
            setShowModal(true)
            setModalContent(
              prev => prev + `\n（但更新联系方式共享设置失败：${sharingRes.msg}）`)
          } else {
            setModalButtonText(<><TfiClose/>&ensp;取消</>)
            setModalOptionalButton(jumpButton)
          }
        })

      } else {
        setModalButtonText('确认')
        setModalOptionalButton(null)
      }
    })
  }

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
            <div>齐鲁工业大学</div>
            <div>新生信息采集表</div>
          </div>
        </div>

        <div
          className="border rounded-lg border-gray-400/50 bg-white/30 backdrop-blur px-4 py-4 mx-4 mt-16 text-gray-700">
          <div
            className="text-xl underline underline-offset-8 decoration-pink-500 decoration-2 font-medium py-2">
            信息采集须知
          </div>
          <div className="pt-2 indent-8">
            本表单为齐鲁工业大学官方新生信息采集表单，请详细、准确的填写信息。<b>我们将会妥善的保护您的隐私数据</b>。
          </div>
          <div className="pb-2 indent-8">
            除本表单外，任何第三方提供的、以校园网开通或赠送礼品等为名义的个人信息收集表单均非官方渠道，请各位新生注意保护信息安全，谨防电信诈骗。
          </div>
        </div>

        <form ref={formRef} onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}>
          <input type="text" name="id_card" hidden readOnly value={idCard}/>
          <input type="text" name="token" hidden readOnly value={token}/>

          <div className="border-b border-gray-900/10 p-4 pb-12">
            <div
              className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="name"
                       className="block text-sm font-medium leading-6">
                  姓名
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="gender"
                       className="block text-sm font-medium leading-6">
                  性别
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    <option>男</option>
                    <option>女</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="ethnic"
                       className="block text-sm font-medium leading-6">
                  民族
                </label>
                <div className="mt-2 w-full">
                  <ComboBox
                    list={ethnicList}
                    name="ethnic"
                    value={formData.ethnic}
                    onChange={(value) => setFormData(
                      prev => ({ ...prev, ethnic: value }))}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone"
                       className="block text-sm font-medium leading-6">
                  个人电话
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="个人电话"
                    autoComplete="tel"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="qq"
                       className="block text-sm font-medium leading-6">
                  个人 QQ 号
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="qq"
                    id="qq"
                    value={formData.qq}
                    onChange={handleInputChange}
                    placeholder="个人 QQ 号"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-full">
                <div className="mt-2 flex flex-col items-start space-y-3">
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    联系方式共享设置
                    <p className="mt-1 text-sm text-gray-600 font-normal">
                      *
                      以提前联系为目的，勾选后，您可在本系统的“宿舍查询”、“分班查询”中看到同宿舍/同班同学的联系方式，方便提前联系。
                    </p>
                  </div>

                  {/* 舍友 */}
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 w-full rounded-lg border border-gray-200 p-2 sm:w-auto sm:justify-start sm:gap-x-6 sm:border-none sm:p-0">
                    <label
                      className="block text-sm font-medium leading-6 text-gray-900 sm:w-32">
                      向<b className="font-semibold">舍友</b>共享:
                    </label>
                    <div className="flex items-center flex-wrap gap-x-4">
                      <div className="flex items-center">
                        <input
                          id="share-phone-roommate"
                          name="sharePhoneRoommate"
                          type="checkbox"
                          checked={contactSharingOptions.roommate.sharePhone}
                          onChange={(e) => handleSharingChange('roommate',
                            'sharePhone', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label htmlFor="share-phone-roommate"
                               className="ml-2 block text-sm leading-6 text-gray-900">
                          个人电话
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="share-qq-roommate"
                          name="shareQqRoommate"
                          type="checkbox"
                          checked={contactSharingOptions.roommate.shareQq}
                          onChange={(e) => handleSharingChange('roommate',
                            'shareQq', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label htmlFor="share-qq-roommate"
                               className="ml-2 block text-sm leading-6 text-gray-900">
                          个人 QQ 号
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 同班同学 */}
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 w-full rounded-lg border border-gray-200 p-2 sm:w-auto sm:justify-start sm:gap-x-6 sm:border-none sm:p-0">
                    <label
                      className="block text-sm font-medium leading-6 text-gray-900 sm:w-32">
                      向<b className="font-semibold">同班同学</b>共享:
                    </label>
                    <div className="flex items-center flex-wrap gap-x-4">
                      <div className="flex items-center">
                        <input
                          id="share-phone-classmate"
                          name="sharePhoneClassmate"
                          type="checkbox"
                          checked={contactSharingOptions.classmate.sharePhone}
                          onChange={(e) => handleSharingChange('classmate',
                            'sharePhone', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label htmlFor="share-phone-classmate"
                               className="ml-2 block text-sm leading-6 text-gray-900">
                          个人电话
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="share-qq-classmate"
                          name="shareQqClassmate"
                          type="checkbox"
                          checked={contactSharingOptions.classmate.shareQq}
                          onChange={(e) => handleSharingChange('classmate',
                            'shareQq', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                        />
                        <label htmlFor="share-qq-classmate"
                               className="ml-2 block text-sm leading-6 text-gray-900">
                          个人 QQ 号
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="guardian-name"
                       className="block text-sm font-medium leading-6">
                  监护人姓名
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="guardianName"
                    id="guardian-name"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    placeholder="监护人姓名"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="guardian-phone"
                       className="block text-sm font-medium leading-6">
                  监护人电话
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="guardianPhone"
                    id="guardian-phone"
                    value={formData.guardianPhone}
                    onChange={handleInputChange}
                    placeholder="监护人电话"
                    autoComplete="tel"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/*省份*/}
              <div className="sm:col-span-2">
                <label htmlFor="province"
                       className="block text-sm font-medium leading-6">
                  家庭地址
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="province"
                    name="province"
                    value={province}
                    onChange={(e) => {
                      console.debug(e)
                      if (e.target.value !== province) {
                        setProvince(e.target.value)
                        setProvinceIndex(
                          parseInt(e.target.selectedOptions[0].id))
                        setPrefecture('')
                        setPrefectureIndex(-1)
                        setCounty('')
                      }
                    }}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {level.map((province, index) =>
                      <option key={province.code}
                              id={index}>{province.name}</option>,
                    )
                    }
                  </select>
                </div>
              </div>

              {/*地级市*/}
              <div
                className={`sm:col-span-2 ${(provinceIndex === -1 ||
                  level[provinceIndex].children === undefined ||
                  level[provinceIndex].children.length === 0) && 'hidden'}`}>
                <label htmlFor="prefecture"
                       className="hidden sm:block text-sm font-medium leading-6">
                  &emsp;
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="prefecture"
                    name="prefecture"
                    value={prefecture}
                    onChange={(e) => {
                      if (e.target.value !== prefecture) {
                        setPrefecture(e.target.value)
                        setPrefectureIndex(
                          parseInt(e.target.selectedOptions[0].id))
                        setCounty('')
                      }
                    }}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {provinceIndex !== -1 &&
                      level[provinceIndex]?.children?.map((prefecture, index) =>
                        <option key={prefecture.code}
                                id={index}>{prefecture.name}</option>,
                      )}
                  </select>
                </div>
              </div>

              {/*县级市*/}
              <div
                className={`sm:col-span-2 ${(prefectureIndex === -1 ||
                  level[provinceIndex].children[prefectureIndex].children ===
                  undefined ||
                  level[provinceIndex].children[prefectureIndex].children.length ===
                  0) && 'hidden'}`}>
                <label htmlFor="county"
                       className="hidden sm:block text-sm font-medium leading-6">
                  &emsp;
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="county"
                    name="county"
                    value={county}
                    onChange={(e) => {
                      if (e.target.value !== county) {
                        setCounty(e.target.value)
                      }
                    }}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {prefectureIndex !== -1 &&
                      level[provinceIndex]?.children[prefectureIndex]?.children?.map(
                        (county, index) =>
                          <option key={county.code}
                                  id={index}>{county.name}</option>,
                      )}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-full">
                <label htmlFor="address"
                       className="block text-sm font-medium leading-6">
                  详细地址
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="详细地址"
                    autoComplete="address"
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="height"
                       className="block text-sm font-medium leading-6">
                  身高
                </label>
                <div className="mt-2 w-full">
                  <div
                    className="flex items-center justify-between rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="number"
                      name="height"
                      id="height"
                      min={10}
                      max={300}
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="身高"
                      required
                      className="block w-full border-0 bg-transparent py-1.5 pr-1 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                    />
                    <span
                      className="grow select-none break-keep pl-2 pr-3 text-gray-500 text-sm">厘米</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="weight"
                       className="block text-sm font-medium leading-6">
                  体重
                </label>
                <div className="mt-2 w-full">
                  <div
                    className="flex items-center justify-between rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      min={10}
                      max={500}
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="体重"
                      required
                      className="block w-full border-0 bg-transparent py-1.5 pr-1 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                    />
                    <span
                      className="grow select-none break-keep pl-2 pr-3 text-gray-500 text-sm">千克</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="blood-type"
                       className="block text-sm font-medium leading-6">
                  血型
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="blood-type"
                    name="blood"
                    value={formData.blood}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    <option>A 型</option>
                    <option>B 型</option>
                    <option>O 型</option>
                    <option>AB 型</option>
                    <option value="unknown">其他血型 / 我不知道</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="text-sm">
                  * 身体数据仅用于校医院健康档案与军训服装订购
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="studentLoan"
                       className="block text-sm font-medium leading-6">
                  是否已经或者正在办理生源地信用助学贷款
                </label>
                <div className="mt-2 w-full">
                  <div
                    className="grid grid-cols-1 sm:grid-cols-3 items-center justify-start gap-x-2 text-sm">
                    <div className="grow text-nowrap whitespace-nowrap">
                      <input
                        type="radio"
                        name="studentLoan"
                        id="loan-china-development-bank"
                        className="m-2 accent-sky-600"
                        checked={formData.studentLoan === '是（国家开发银行）'}
                        onChange={handleInputChange}
                        value="是（国家开发银行）"
                      />
                      <label htmlFor="loan-china-development-bank"
                             className="py-3 w-full inline-block">是（国家开发银行）</label>
                    </div>
                    <div className="grow text-nowrap whitespace-nowrap">
                      <input
                        type="radio"
                        name="studentLoan"
                        id="loan-other-bank"
                        className="m-2 accent-sky-600"
                        checked={formData.studentLoan === '是（其他银行）'}
                        onChange={handleInputChange}
                        value="是（其他银行）"
                      />
                      <label htmlFor="loan-other-bank"
                             className="py-3 w-full inline-block">是（其他银行）</label>
                    </div>
                    <div className="grow text-nowrap whitespace-nowrap">
                      <input
                        type="radio"
                        name="studentLoan"
                        id="loan-none"
                        className="m-2 accent-sky-600"
                        checked={formData.studentLoan === '否'}
                        onChange={handleInputChange}
                        value="否"
                      />
                      <label htmlFor="loan-none"
                             className="py-3 w-full inline-block">否</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="military-discharged"
                       className="block text-sm font-medium leading-6">
                  是否为退役大学生
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="military-discharged"
                    name="militaryDischarged"
                    value={formData.militaryDischarged}
                    onChange={handleInputChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    <option>是</option>
                    <option>否</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="military-intention"
                       className="block text-sm font-medium leading-6">
                  是否有参军入伍意向
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="military-intention"
                    name="militaryIntention"
                    value={formData.militaryIntention}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    <option>是</option>
                    <option>否</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="military-time"
                       className="block text-sm font-medium leading-6">
                  若有参军意向，你志愿在何时入伍
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="military-time"
                    name="militaryTime"
                    value={formData.militaryTime}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 text-sm sm:leading-6"
                  >
                    <option value=""></option>
                    <option>新生入学报到前</option>
                    <option>大一</option>
                    <option>大二</option>
                    <option>大三</option>
                    <option>大四</option>
                    <option>大学毕业后</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-full">
                <div className="mt-2 flex flex-col items-start">
                  <div className="flex items-center">
                    <Switch
                      name="networkApply"
                      id="network-apply"
                      checked={networkApply}
                      onChange={setNetworkApply}
                      className={`${networkApply
                        ? 'bg-sky-600 dark:bg-sky-700'
                        : 'bg-gray-600'} relative inline-flex h-[26px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                    >
                    <span
                      aria-hidden="true"
                      className={`${networkApply
                        ? 'translate-x-6'
                        : 'translate-x-0'} pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                    </Switch>
                    <label htmlFor="network-apply"
                           className="ml-4 block py-0 text-sm font-medium leading-6">
                      开通齐鲁工业大学融合校园网
                    </label>
                  </div>
                  <div className="mt-2 text-sm">*
                    齐鲁工业大学校园网可直接连入校内作业考试、教务管理、图书馆资源、正版化软件等信息化系统。若选择开通，运营商将免费寄送绑定校园网融合套餐的手机卡至填写的家庭地址，自行激活校园卡后即可享受校园优惠套餐。
                  </div>
                  {networkApply && (
                    <div className="mt-4 text-sm flex flex-col space-y-4">
                      <div
                        className="grow text-nowrap whitespace-nowrap flex items-center">
                        <input
                          type="checkbox"
                          name="campusNetworkCmcc"
                          id="campus-network-cmcc"
                          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                          checked={campusNetworkSelections[0] === '济南移动'}
                          onChange={e => handleCampusNetworkChange(0,
                            e.target.checked, '济南移动')}
                        />
                        <label htmlFor="campus-network-cmcc"
                               className="ml-2 block text-sm leading-6 text-gray-900">济南移动</label>
                      </div>
                      <div
                        className="grow text-nowrap whitespace-nowrap flex items-center">
                        <input
                          type="checkbox"
                          name="campusNetworkCu"
                          id="campus-network-cu"
                          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                          checked={campusNetworkSelections[1] === '济南联通'}
                          onChange={e => handleCampusNetworkChange(1,
                            e.target.checked, '济南联通')}
                        />
                        <label htmlFor="campus-network-cu"
                               className="ml-2 block text-sm leading-6 text-gray-900">济南联通</label>
                      </div>
                      <div
                        className="grow text-nowrap whitespace-nowrap flex items-center">
                        <input
                          type="checkbox"
                          name="campusNetworkCt"
                          id="campus-network-ct"
                          className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-600"
                          checked={campusNetworkSelections[2] === '济南电信'}
                          onChange={e => handleCampusNetworkChange(2,
                            e.target.checked, '济南电信')}
                        />
                        <label htmlFor="campus-network-ct"
                               className="ml-2 block text-sm leading-6 text-gray-900">济南电信</label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sm:col-span-full md:flex">
                <button
                  type="submit"
                  className="rounded-md bg-qlu w-full md:w-32 md:rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  提交
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>

      <PageFooter/>

      <Modal isOpen={showModal} setIsOpen={setShowModal}
             buttonText={modalButtonText}
             optionalButton={modalOptionalButton}>
        {modalContent}
      </Modal>
    </>
  )
}