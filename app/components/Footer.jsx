import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-background dark:bg-background-dark border-t border-gray-200 dark:border-0 text-gray-600">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-1 mb-4">
            <span className="w-14">
              <img className="w-full" src="/logo-blue-2.png" alt="" />
            </span>
            <span className="font-semibold text-primary dark:text-primary-dark text-lg">
              SharkStage
            </span>
          </div>
          <p className="text-sm mb-4">
            The world's leading marketplace for buying and selling investment
            projects.
          </p>
          <div className="flex gap-3 text-gray-500 text-xl">
            <a href="#" className="hover:text-primary">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-primary">
              <FaXTwitter />
            </a>
            <a href="#" className="hover:text-primary">
              <FaLinkedinIn />
            </a>
            <a href="#" className="hover:text-primary">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold dark:text-background mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-primary">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Account
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 dark:text-background">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-primary">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 dark:text-background">
            Contact Us
          </h3>
          <ul className="space-y-2 text-sm">
            <li>📍 123 Investment Street, Finance District, NY 10001</li>
            <li>📞 +1 (555) 123-4567</li>
            <li>✉️ contact@sharkstage.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 text-center py-4 text-sm text-gray-500">
        © 2025 SharkStage. All rights reserved.
      </div>
    </footer>
  );
}
