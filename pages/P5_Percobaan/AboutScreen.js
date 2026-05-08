import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AboutScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isViewingPhoto, setIsViewingPhoto] = useState(false);

    const cameraRef = useRef(null);

    const STORAGE_KEY = '@profile_photo';

    useEffect(() => {
        loadProfilePhoto();
    }, []);

    const loadProfilePhoto = async () => {
        try {
            const savedPhotoUri = await AsyncStorage.getItem(STORAGE_KEY);
            if (savedPhotoUri !== null) {
                setProfilePhoto(savedPhotoUri);
            }
        } catch (error) {
            console.error("Gagal memuat foto profil", error);
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });

                setProfilePhoto(photo.uri);

                await AsyncStorage.setItem(STORAGE_KEY, photo.uri);

                setIsCameraOpen(false);

                Alert.alert("Berhasil", "Foto profil berhasil diperbarui!");
            } catch (error) {
                Alert.alert("Error", "Gagal mengambil foto selfie.");
            }
        }
    };

    if (isCameraOpen) {
        if (!permission) return <View style={styles.container}><Text>Memuat perizinan...</Text></View>;
        if (!permission.granted) {
            return (
                <View style={styles.container}>
                    <Text style={styles.infoText}>Kami butuh akses kamera untuk Selfie Profil.</Text>
                    <TouchableOpacity style={styles.button} onPress={requestPermission}>
                        <Text style={styles.buttonText}>Beri Izin Kamera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonDanger} onPress={() => setIsCameraOpen(false)}>
                        <Text style={styles.buttonText}>Batal</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                <CameraView 
                    style={StyleSheet.absoluteFillObject} 
                    facing="front"
                    mirror={false}
                    ref={cameraRef}
                />
                <View style={styles.cameraOverlay}>
                    <View style={styles.captureContainer}>
                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <Text style={styles.captureButtonText}>Jepret</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setIsCameraOpen(false)}>
                            <Text style={styles.buttonText}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileCard}>
                
                <View style={styles.imageContainer}>
                    {profilePhoto ? (
                        <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={() => setIsViewingPhoto(true)}>
                            <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.placeholderImage}>
                            <Text style={styles.placeholderText}>Belum Ada Foto</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.nameText}>Muhamad Zaldi Aprialdi</Text>
                <Text style={styles.nimText}>NIM: 0325260031</Text>
                <Text style={styles.programText}>Manajemen Informatika</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsCameraOpen(true)}
                >
                    <Text style={styles.buttonText}>
                        {profilePhoto ? "Ganti Foto Profil" : "Ambil Foto Profil"}
                    </Text>
                </TouchableOpacity>

            </View>

            <Modal visible={isViewingPhoto} transparent={true} animationType="fade" onRequestClose={() => setIsViewingPhoto(false)}>
                <TouchableWithoutFeedback onPress={() => setIsViewingPhoto(false)}>
                    <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback onPress={() => {}}>
                            <Image source={{ uri: profilePhoto }} style={styles.fullScreenImage} />
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileCard: {
        backgroundColor: 'white',
        width: '85%',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    imageContainer: {
        marginBottom: 20,
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#0056b3',
        transform: [{ scaleX: -1 }],
    },
    placeholderImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ced4da',
        borderStyle: 'dashed',
    },
    placeholderText: {
        color: '#6c757d',
        fontWeight: 'bold',
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        textAlign: 'center',
    },
    nimText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    programText: {
        fontSize: 14,
        color: '#0056b3',
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#0056b3',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonDanger: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoText: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
    },

    cameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    captureContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 40,
    },
    captureButton: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        elevation: 5,
    },
    captureButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    cancelButton: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: '90%',
        height: '60%',
        resizeMode: 'contain',
        transform: [{ scaleX: -1 }],
    }
});
