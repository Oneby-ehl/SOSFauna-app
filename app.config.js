// The alternate router root is only selected by the explicit WEB build commands.
// Normal Expo/Android configuration and app.json remain unchanged.
module.exports = ({ config }) => {
  const target = process.env.SOS_FAUNA_BUILD_TARGET;
  if (!['local-preview', 'publication'].includes(target)) return config;
  const preview = target === 'local-preview';
  if (preview && (process.env.CI || process.env.GITHUB_ACTIONS)) throw new Error('La vista previa no puede compilarse en CI.');
  if (process.env.EXPO_PUBLIC_SOS_FAUNA_STATIC_PREVIEW !== (preview ? '1' : '0')) throw new Error('Destino web incoherente. Utiliza los scripts build/build:web.');
  const routerRoot = '.expo/bilingual-web/app';
  return {
    ...config,
    extra: { ...config.extra, router: { ...config.extra?.router, root: routerRoot } },
    plugins: (config.plugins || []).map(plugin => {
      const name = Array.isArray(plugin) ? plugin[0] : plugin;
      return name === 'expo-router' ? [name, { ...(Array.isArray(plugin) ? plugin[1] : {}), root: routerRoot }] : plugin;
    }),
  };
};
