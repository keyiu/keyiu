import fs from 'fs';
/**
 * 获取装载项目的所有controller
 * @param workspace 项目的根目录
 */
export async function serviceLoader(workspace: string) {
  const serviceBasePath = `${workspace}/api`;
  const clazzs = await Promise.all(
    fs
      .readdirSync(serviceBasePath)
      .filter((file) => !(/\.map$/.test(file) || /\.spec\./.test(file)))
      .map(async (file) => {
        const filePath = `${serviceBasePath}/${file}`;
        const { default: clazz } = await import(filePath);
        return clazz;
      }),
  );
  return clazzs;
}
export default {
  serviceLoader,
};
