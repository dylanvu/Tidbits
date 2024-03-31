from moviepy.editor import ColorClip

# Define the duration and size of the blank clip
duration = 10  # Duration in seconds
size = (1920, 1080)  # Size in pixels

# Create a black color clip (you can change the color by changing the (0, 0, 0) values)
black_clip = ColorClip(size, color=(0, 0, 0), duration=duration)

# Define the output path for the video file
output_path = "blank_video.mp4"

# Write the clip to a video file
black_clip.write_videofile(output_path, fps=24)

print("Video file has been created:", output_path)
