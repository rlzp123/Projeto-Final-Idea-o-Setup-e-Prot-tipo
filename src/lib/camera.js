import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export async function captureRoomPhoto() {
  const photo = await Camera.getPhoto({
    quality: 72,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
    correctOrientation: true,
  })
  return photo.dataUrl
}