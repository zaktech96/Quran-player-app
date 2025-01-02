import { Computer, Network, Zap } from 'lucide-react';
import { OrbitingCirclesComponent } from './orbiting-circles';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';

const features = [
  {
    name: 'Build faster',
    description:
      'Get up and running in no time with pre-configured settings and best practices. Say goodbye to setup and focus on what truly matters - building your application.',
    icon: Zap,
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    name: 'Production Ready',
    description:
      'Built with modern tools and best practices. Authentication, database, payments, and more - everything you need to launch your SaaS is included.',
    icon: Computer,
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    name: 'Scale with ease',
    description:
      'Built on a rock-solid foundation with NextJS, TypeScript, and Tailwind CSS. Deploy with confidence and scale without worry.',
    icon: Network,
    gradient: 'from-green-400 to-teal-500',
  },
];

export default function SideBySide() {
  return (
    <div className="overflow-hidden py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
                Deploy Faster
              </h2>
              <p
                className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}
              >
                A faster way to production
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Launch your next project with confidence using our battle-tested stack and pre-built components.
              </p>
              <dl className="mt-10 max-w-xl space-y-10 leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-12 transition-all duration-300 hover:translate-x-2">
                    <div className={`absolute left-0 top-1 rounded-lg p-2 bg-gradient-to-r ${feature.gradient}`}>
                      <feature.icon 
                        className="h-5 w-5 text-white" 
                        aria-hidden="true" 
                      />
                    </div>
                    <dt className="inline font-semibold dark:text-gray-100 text-gray-900 text-lg">
                      {feature.name}
                    </dt>
                    <dd className="mt-2 dark:text-gray-400 text-gray-600">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-10 blur-3xl" />
            <OrbitingCirclesComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
