import os
from moviepy import VideoFileClip

input_path = os.path.join("public", "video", "anime.mp4")
output_path = os.path.join("public", "video", "anime.webm")

print(f"Loading {input_path}...")

if not os.path.exists(input_path):
    print("Error: Input file not found!")
    exit(1)

try:
    # Load video
    clip = VideoFileClip(input_path)
    
    # Convert to WebM using libvpx (standard for WebM)
    # bitrate set to maintain quality but reduce size slightly
    print("Starting conversion... This might take a minute.")
    clip.write_videofile(output_path, codec='libvpx', audio_codec='libvorbis', logger='bar')
    
    clip.close()
    print(f"Success! Saved to {output_path}")

except Exception as e:
    print(f"Conversion failed: {e}")
