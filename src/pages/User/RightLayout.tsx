import React from 'react'

function RightLayout() {
  return (
    <div className="hidden relative lg:block lg:w-1/2">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-100 opacity-90"></div>

      {/* Background image */}
      <img
        src="Logo.png"
        alt="Ticket Desk"
        className="h-full w-full object-cover opacity-40"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-gray-900">
        <h2 className="mb-4 text-3xl font-semibold">
          Jira Inspired Ticketing System
        </h2>

        <p className="mb-6 max-w-md text-center text-lg font-extralight">
          “Simplifying Issue management.”
            <div className="mt-6 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-white">
                <a href="https://github.com/siddharthramagiri" target='blank'>
                    <img className="h-12 w-12 rounded-full" src='https://avatars.githubusercontent.com/u/86881570?v=4'/>
                </a>
                </div>
                <div className="ml-4 text-black font-thin">
                <p className="font-medium">Developed by</p>
                <p className="text-sm opacity-80"> 
                    <a href="https://github.com/siddharthramagiri" target='blank'>
                    Siddu Ramagiri
                    </a>
                </p>
                </div>
            </div>
        </p>


        {/* Demo credentials */}
        <div className="rounded-lg  p-6 backdrop-blur-sm">
            <h3 className="mb-2 text-lg font-semibold text-center">
                Demo Login Credentials to test
            </h3>

            <ul className="space-y-1 text-sm font-mono text-gray-800">
                <li><strong>Admin:</strong> admin@gmail.com </li>
                <li><strong>Client:</strong> client@gmail.com </li>
                <li><strong>Support:</strong> support@gmail.com </li>
                <li><strong>Developer:</strong> developer@gmail.com </li>
                <li><strong>Password:</strong> 1234</li>
            </ul>
        </div>
      </div>
    </div>
  )
}

export default RightLayout
