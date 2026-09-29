import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If building for GitHub Pages, repo name is Secure-Doc
  basePath: isGithubPages ? '/Secure-Doc' : '',
  assetPrefix: isGithubPages ? '/Secure-Doc/' : '',
};

export default nextConfig;
