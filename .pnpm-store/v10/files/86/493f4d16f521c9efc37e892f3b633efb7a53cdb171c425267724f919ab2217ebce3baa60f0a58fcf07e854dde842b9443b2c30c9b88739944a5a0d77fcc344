import {useState,useEffect,useMemo}from'react';import {css,jsx}from'storybook/theming';import {Placeholder}from'storybook/internal/components';var c=({config:e,defer:o=false})=>{let[r,t]=useState(o?void 0:e.url),[a,l]=useState(false);return useEffect(()=>{if(!o)return;let d=requestAnimationFrame(()=>{t(e.url);});return ()=>cancelAnimationFrame(d)},[o,e.url]),useEffect(()=>{l(false);},[r]),jsx("div",{css:u},!a&&jsx(Placeholder,{css:p},"Loading..."),jsx("iframe",{css:h,src:r,allowFullScreen:e.allowFullscreen,onLoad:()=>l(true)}))};var u=css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  overflow: hidden;
`,p=css`
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
`,h=css`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;

  z-index: 1;
`;var w=/https:\/\/[\w.-]+\.?figma.com\/([\w-]+)\/([0-9a-zA-Z]{22,128})(?:\/.*)?$/,b=e=>w.test(e),y=({config:e})=>{let o=useMemo(()=>b(e.url)?{url:P(e.url,e.embedHost||location.hostname),allowFullscreen:e.allowFullscreen}:(console.warn(`[storybook-addon-designs] The URL you specified is not valid Figma URL.
The addon fallbacks to normal iframe mode.For more detail, please check <https://www.figma.com/developers/embed>.`),e),[e.url,e.allowFullscreen,e.embedHost]);return jsx(c,{defer:true,config:o})};function P(e,o){let r=new URL(e);r.hostname=r.hostname.replace(/^www\./,"embed."),r.searchParams.delete("embed_origin"),r.searchParams.set("embed-host",o);for(let[t,a]of r.searchParams)r.searchParams.delete(t),r.searchParams.set(t.replace(/_/g,"-"),a);return r.href}
export{c as a,w as b,y as c};