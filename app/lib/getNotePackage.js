const getNotePackage = async (noteJson) => {
  const packageResp = await fetch("/api/xhs/package", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteJson),
  });
  if (!packageResp.ok) {
    return null;
  }
  return await packageResp.blob();
};

export default getNotePackage;
