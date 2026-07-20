# ResumeCraft 🚀

**Website:** [https://resumecraft.co.in](https://resumecraft.co.in)

ResumeCraft is an advanced, AI-powered resume builder designed to help job seekers land their dream roles. Whether you are a fresher or an experienced professional, ResumeCraft provides you with the tools, templates, and insights needed to create ATS-friendly resumes that stand out to recruiters and Applicant Tracking Systems (ATS).

## ✨ Key Features

- 🤖 **AI-Powered Resume Building**: Automatically generate professional summaries, skill sections, and impactful bullet points using cutting-edge AI.
- 📄 **ATS-Friendly Templates**: Professionally designed templates tailored for various roles (Software Engineer, Data Analyst, Marketing Manager, Fresher, Teacher, and more).
- 📊 **ATS Resume Checker**: Analyze your resume and preview how it scores against standard ATS algorithms before you apply.
- ✉️ **Cover Letter Generator**: Matching cover letter designs to complement your resume and complete your professional application package.
- 📝 **Career Blog & Resources**: Access expert career advice, interview tips, and resume formatting guides directly on the platform.
- ⚡ **Lightning Fast & Responsive**: Built with modern web technologies for a seamless, interactive experience on both desktop and mobile devices.
- 🖨️ **High-Quality Export**: Export your generated resumes seamlessly to PDF format with perfect layout retention.
- 🔒 **Privacy Focused**: Your personal data is secure, and you have full control over your information.

## 🛠️ Tech Stack

- **Frontend Core**: React.js, Vite, React Router DOM
- **Styling & Animations**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **SEO & Rendering**: Puppeteer (Prerendering engine), React Helmet Async
- **Utilities**: html2canvas, jsPDF

## 🚀 Getting Started (Local Development)

If you'd like to run ResumeCraft locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gautam-kumar01/Resumecraft.git
   ```

2. **Navigate to the client directory:**
   ```bash
   cd Resumecraft/client
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Build & Production

ResumeCraft uses a custom prerendering script to ensure optimal SEO performance across search engines.

To build the project:
```bash
npm run build
```
This command will build the Vite app and automatically run the `postbuild` script (`node prerender.js`). This generates static HTML files for all dynamic routes (including blogs) and compiles the `sitemap.xml`.

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check the issues page or submit a Pull Request.

---

**Start building your professional ATS-friendly resume today at [https://resumecraft.co.in](https://resumecraft.co.in)!**
