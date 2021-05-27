
export function matchClass(Class, object) {
  if (!(object instanceof Class)) return -1;

  return Class.ClassID.length;
}

