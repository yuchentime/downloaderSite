const getNoteJson = async (url) => {
  const noteResp = await fetch(
    `/api/xhs/downloader?url=${JSON.stringify(url)}`
  );
  if (!noteResp.ok) {
    return null;
  }
  return await noteResp.json();
};

export default getNoteJson;
