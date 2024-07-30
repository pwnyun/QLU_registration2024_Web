import {Link, useNavigate} from "react-router-dom";
import {FaArrowRight} from "react-icons/fa6";
import {useEffect} from "react";
import localforage from "localforage";

export default function Directions() {
  const features = [
    {
      name: '一号通激活',
      description: 'text',
      icon: FaArrowRight,
      url: 'https://wlyw.qlu.edu.cn/wiki/help/sso/',
      target: '_blank'
    }, {
      name: '信息采集',
      description: 'text',
      icon: FaArrowRight,
      url: '/collection-form',
      target: '_blank'
    }, {
      name: '线上缴费',
      description: 'text',
      icon: FaArrowRight,
      url: '',
      target: '_blank'
    }, {
      name: 'OS 平台注册',
      description: 'text',
      icon: FaArrowRight,
      url: '',
      target: '_blank'
    }, {
      name: '宿舍查询',
      description: 'text',
      icon: FaArrowRight,
      url: '',
      target: '_blank'
    }, {
      name: '分班信息查询',
      description: 'text',
      icon: FaArrowRight,
      url: '',
      target: '_blank'
    }, {
      name: '预报到',
      description: 'text',
      icon: FaArrowRight,
      url: '/pre-check-in',
      target: '_blank'
    },]
  const navigate = useNavigate();

  // 检查是否已登录
  useEffect(() => {
    localforage.getItem("login_info").then(info => {
      console.log("login_info", info)

      // TODO 检查token是否和用户信息匹配

      if (!true) {
        navigate('/')
      }
    })
  }, []);

  return (<>
    <div className="overflow-hidden bg-white py-24 md:py-32 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">

          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-qlu">齐鲁工业大学</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">线上报到流程</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                各位同学，请遵循以下流程完成线上报到。
              </p>
              <PageImage className="block md:hidden w-full h-[50vw]"/>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <Link key={feature.name}
                        to={feature.url}
                        target={feature.target}
                        className="block relative py-2 pl-11 border rounded border-transparent hover:border-gray-300"
                  >
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon className="absolute left-3 top-3 h-5 w-5 text-qlu" aria-hidden="true"/>
                      {feature.name}
                    </dt>
                    <br/>
                    <dd className="inline">{feature.description}</dd>
                  </Link>
                ))}
              </dl>
            </div>
          </div>

          <PageImage className="w-[48rem] h-[28.46rem] hidden md:block sm:w-[57rem] md:-ml-4 lg:-ml-0"/>

        </div>
      </div>
    </div>
  </>)
}

function PageImage({className}) {
  return (<img
    // src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
    src="/assets/banner-raw.png"
    alt="logo"
    // className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
    className={`object-cover max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 w-[2432px] h-[1442px] ${className}`}
  />)
}
