import level from "@province-city-china/level";
import {useEffect, useState} from "react";
import {Switch} from "@headlessui/react";

export default function CollectionForm() {
  useEffect(() => {
    console.log(level)
  }, []);

  const [province, setProvince] = useState("");
  const [provinceIndex, setProvinceIndex] = useState(-1);
  const [prefectural, setPrefectural] = useState("");
  const [prefecturalIndex, setPrefecturalIndex] = useState(-1);
  const [county, setCounty] = useState("");

  const [applyCampusCard, setApplyCampusCard] = useState(true);
  const [applyCampusNetwork, setApplyCampusNetwork] = useState(true);

  return (<>
      <div className="container mx-auto max-w-[750px]">

        <div
          className="fixed mt-[620px] inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
          aria-hidden="true">
          <div
            className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
            style={{clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"}}>
            {/*  clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)
          */}
          </div>
        </div>

        <div className="image-container relative mb-[20px] bg-no-repeat w-full">
          <img className="object-cover object-bottom w-full h-[calc(100%-2px)] absolute left-0 top-0 z-[-10]"
               src="/assets/banner.png"/>
          <img className="object-cover w-full h-[calc(100%-4px)]"
               src="/assets/index-bg-mask.svg"/>
          <img className="object-cover translate-x-[-50%] h-[41.58%] absolute left-[50%] bottom-[12.3%] z-10"
               src="/assets/index-avatar-circle.svg"/>
          <img className="object-cover translate-x-[-50%] h-[36.82%] absolute left-[50%] bottom-[15.3%] z-20"
               src="/assets/qlu-logo-space.png"/>
          {/*<img*/}
          {/*  className="object-cover translate-x-[-50%] translate-y-[3px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px]"*/}
          {/*  src="images/index-title.svg"/>*/}
          <div
            className="object-cover translate-x-[-50%] translate-y-[20px] absolute bottom-[3.11%] left-[50%] h-[27px] md:h-[36px] text-nowrap text-2xl flex flex-col justify-center items-center text-qlu font-bold">
            <div>齐鲁工业大学</div>
            <div>信息采集表</div>
          </div>
        </div>


        <div
          className="border rounded-lg border-gray-400/50 bg-white/30 backdrop-blur px-4 py-4 mx-4 mt-16 text-gray-700">
          <div
            className="text-xl underline underline-offset-8 decoration-pink-500 decoration-2 font-medium py-2">校园网申领须知
          </div>
          <div className="pt-2">
            本表单为齐鲁工业大学校园网官方申领入口，请详细、准确的填写信息。<b>我们将会妥善的保护您的隐私数据</b>。当您提交申请后，我们将于七个工作日内邮寄绑定校园网的校园电话卡。
          </div>
          <div className="py-1 text-center text-gray-400 select-none">·&ensp;·&ensp;·&ensp;·</div>
          <div className="pb-2">
            除本表单外，任何第三方提供的、以校园网开通为名义的个人信息收集表单均非官方渠道，请各位新生注意保护信息安全，谨防诈骗。有任何疑问请联系齐鲁工业大学网络信息中心
            <a href="tel:0531-89631358">0531-89631358</a>。
          </div>
        </div>

        <form method="post" action="/submit">
          <div className="border-b border-gray-900/10 p-4 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6">
                  姓名
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    disabled
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="gender" className="block text-sm font-medium leading-6">
                  性别
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="gender"
                    name="gender"
                    defaultValue=""
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    <option>男</option>
                    <option>女</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium leading-6">
                  个人电话
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="个人电话"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="qq" className="block text-sm font-medium leading-6">
                  个人QQ号
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="qq"
                    id="qq"
                    placeholder="个人QQ号"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="guardian-name" className="block text-sm font-medium leading-6">
                  监护人姓名
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="guardian-name"
                    id="guardian-name"
                    placeholder="监护人姓名"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="guardian-phone" className="block text-sm font-medium leading-6">
                  监护人电话
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="guardian-phone"
                    id="guardian-phone"
                    placeholder="监护人电话"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/*省份*/}
              <div className="sm:col-span-2">
                <label htmlFor="province" className="block text-sm font-medium leading-6">
                  家庭地址
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="province"
                    name="province"
                    value={province}
                    onChange={(e) => {
                      console.log(e);
                      if (e.target.value !== province) {
                        setProvince(e.target.value);
                        setProvinceIndex(parseInt(e.target.selectedOptions[0].id))
                        setPrefectural("")
                        setPrefecturalIndex(-1)
                        setCounty("")
                      }
                    }}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {level
                      .sort((a, b) => {
                        if (b.name === "山东省") return 1
                      })
                      .map((province, index) =>
                        <option key={province.code} id={index}>{province.name}</option>
                      )
                    }
                  </select>
                </div>
              </div>

              {/*地级市*/}
              <div
                className={`sm:col-span-2 ${(provinceIndex === -1 || level[provinceIndex].children === undefined || level[provinceIndex].children.length === 0) && 'hidden'}`}>
                <label htmlFor="prefectural" className="hidden sm:block text-sm font-medium leading-6">
                  &emsp;
                </label>
                <div className="mt-2 w-full">
                  <select
                    id="prefectural"
                    name="prefectural"
                    value={prefectural}
                    onChange={(e) => {
                      if (e.target.value !== prefectural) {
                        setPrefectural(e.target.value);
                        setPrefecturalIndex(parseInt(e.target.selectedOptions[0].id))
                        setCounty("")
                      }
                    }}
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {provinceIndex !== -1 && level[provinceIndex]?.children?.map((prefectural, index) =>
                      <option key={prefectural.code} id={index}>{prefectural.name}</option>
                    )}
                  </select>
                </div>
              </div>

              {/*县级市*/}
              <div
                className={`sm:col-span-2 ${(prefecturalIndex === -1 || level[provinceIndex].children[prefecturalIndex].children === undefined || level[provinceIndex].children[prefecturalIndex].children.length === 0) && 'hidden'}`}>
                <label htmlFor="county" className="hidden sm:block text-sm font-medium leading-6">
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
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs text-sm sm:leading-6"
                  >
                    <option value="" disabled hidden></option>
                    {prefecturalIndex !== -1 && level[provinceIndex]?.children[prefecturalIndex]?.children?.map((county, index) =>
                      <option key={county.code} id={index}>{county.name}</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-full">
                <label htmlFor="address" className="block text-sm font-medium leading-6">
                  详细地址
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="详细地址"
                    autoComplete="address"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="height" className="block text-sm font-medium leading-6">
                  身高
                </label>
                <div className="mt-2 w-full">
                  <div
                    className="flex items-center justify-between rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="number"
                      name="height"
                      id="height"
                      min={0}
                      max={300}
                      step={2}
                      placeholder="身高"
                      className="block w-full border-0 bg-transparent py-1.5 pr-1 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                    />
                    <span className="grow select-none break-keep pl-2 pr-3 text-gray-500 text-sm">厘米</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="weight" className="block text-sm font-medium leading-6">
                  体重
                </label>
                <div className="mt-2 w-full">
                  <div
                    className="flex items-center justify-between rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      min={0}
                      max={600}
                      step={5}
                      placeholder="体重"
                      className="block w-full border-0 bg-transparent py-1.5 pr-1 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                    />
                    <span className="grow select-none break-keep pl-2 pr-3 text-gray-500 text-sm">千克</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="blood-type" className="block text-sm font-medium leading-6">
                  血型
                </label>
                <div className="mt-2 w-full">
                  <input
                    type="text"
                    name="blood-type"
                    id="blood-type"
                    placeholder="血型"
                    className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/*<div className="sm:col-span-3">*/}
              {/*  <label htmlFor="captcha" className="block text-sm font-medium leading-6">*/}
              {/*    验证码*/}
              {/*  </label>*/}
              {/*  <div className="mt-2 w-full flex items-center gap-x-2">*/}
              {/*    /!*宽度随意，高度最好小于等于36px*!/*/}
              {/*    <img src="" className="bg-amber-500 w-auto h-full flex-grow text-nowrap pr-2" alt="验证码"/>*/}
              {/*    <input*/}
              {/*      type="text"*/}
              {/*      name="captcha"*/}
              {/*      id="captcha"*/}
              {/*      placeholder="验证码"*/}
              {/*      className="block w-full rounded-md border-0 py-1.5 shadow-sm bg-white/20 backdrop-blur ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="sm:col-span-full">
                <div className="mt-2 flex flex-col items-start">
                  <div className="flex items-center">
                    <Switch
                      name="campus-card"
                      id="campus-card"
                      checked={applyCampusCard}
                      onChange={setApplyCampusCard}
                      className={`${applyCampusCard ? 'bg-sky-600 dark:bg-sky-700' : 'bg-gray-600'} relative inline-flex h-[26px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                    >
                        <span
                          aria-hidden="true"
                          className={`${applyCampusCard ? 'translate-x-6' : 'translate-x-0'} pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                    </Switch>
                    <label htmlFor="campus-card" className="ml-4 block py-0 text-sm font-medium leading-6">
                      申领校园手机卡
                    </label>
                  </div>
                  <div className="mt-2 text-sm">*
                    若选择申领，运营商将免费寄送手机校园卡至填写的家庭地址，自行激活校园卡后即可享受校园优惠套餐。
                  </div>
                </div>
              </div>

              <div className="sm:col-span-full">
                <div className="mt-2 flex flex-col items-start">
                  <div className="flex items-center">
                    <Switch
                      name="campus-card"
                      id="campus-card"
                      checked={applyCampusNetwork}
                      onChange={setApplyCampusNetwork}
                      className={`${applyCampusNetwork ? 'bg-sky-600 dark:bg-sky-700' : 'bg-gray-600'} relative inline-flex h-[26px] w-[50px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                    >
                        <span
                          aria-hidden="true"
                          className={`${applyCampusNetwork ? 'translate-x-6' : 'translate-x-0'} pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                    </Switch>
                    <label htmlFor="campus-card" className="ml-4 block py-0 text-sm font-medium leading-6">
                      开通校园网账号
                    </label>
                  </div>
                  <div className="mt-2 text-sm">
                    * <a>校园网资费说明</a>
                  </div>
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

      <div
        className="w-full sticky bottom-0 bg-white/50 backdrop-blur mt-16 py-4 flex flex-col justify-center items-center text-sm text-gray-600 bg-white">
        <div>&copy;2024 齐鲁工业大学 | 网络信息中心</div>
        <div>联系方式：<a href="tel:0531-89631358">0531-89631358</a></div>
      </div>

    </>
  )
}
