FROM ubuntu:kinetic
LABEL author="https://github.com/DigitalExtinction/Game.git"

USER root
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
          ca-certificates \
          git \
          git-lfs \
          python3 \
          python3-openssl \
          unzip \
          wget \
          zip \
          adb \
          openjdk-11-jdk-headless \
          rsync \
          libxcursor-dev \
          libxinerama-dev \
          libxrandr-dev \
          libxi6 \
          libgl1 \
          # End Bugfix Extras
          && rm -rf /var/lib/apt/lists/*


RUN wget -P /opt/butler/ https://gitlab.com/barichello/de-ci/-/raw/master/getbutler.sh
RUN bash /opt/butler/getbutler.sh
RUN /opt/butler/bin/butler -V

ENV PATH="/opt/butler/bin:${PATH}"

# Download and setup web-sdk
ENV WEB_HOME="/usr/lib/web-sdk"
RUN wget https://dl.google.com/web/repository/commandlinetools-linux-7583922_latest.zip \
          && unzip commandlinetools-linux-*_latest.zip -d cmdline-tools \
          && mv cmdline-tools $WEB_HOME/ \
          && rm -f commandlinetools-linux-*_latest.zip

ENV PATH="${WEB_HOME}/cmdline-tools/cmdline-tools/bin:${PATH}"

RUN yes | sdkmanager --licenses \
          && sdkmanager "platform-tools" "build-tools;30.0.3" "platforms;web-29" "cmdline-tools;latest" "cmake;3.10.2.4988404" "ndk;21.4.7075529"

# Adding web keystore and settings
RUN keytool -keyalg RSA -genkeypair -alias webdebugkey -keypass web -keystore debug.keystore -storepass web -dname "CN=Web Debug,O=Web,C=US" -validity 9999 \
          && mv debug.keystore /root/debug.keystore

ARG GODOT_VERSION="4.0"
ARG RELEASE_NAME="stable"

RUN wget https://downloads.tuxfamily.org/godotengine/${GODOT_VERSION}/Godot_v${GODOT_VERSION}-${RELEASE_NAME}_export_templates.tpz
RUN wget https://downloads.tuxfamily.org/godotengine/${GODOT_VERSION}/Godot_v${GODOT_VERSION}-${RELEASE_NAME}_linux.x86_64.zip

RUN mkdir ~/.cache \
          && mkdir -p ~/.config/godot \
          && mkdir -p ~/.local/share/godot/export_templates/${GODOT_VERSION}.${RELEASE_NAME} \
          && unzip Godot_v${GODOT_VERSION}-${RELEASE_NAME}_linux.x86_64.zip \
          && mv Godot_v${GODOT_VERSION}-${RELEASE_NAME}_linux.x86_64 /usr/local/bin/godot \
          && unzip Godot_v${GODOT_VERSION}-${RELEASE_NAME}_export_templates.tpz \
          && mv templates/* ~/.local/share/godot/export_templates/${GODOT_VERSION}.${RELEASE_NAME} \
          && rm -f Godot_v${GODOT_VERSION}-${RELEASE_NAME}_export_templates.tpz Godot_v${GODOT_VERSION}-${RELEASE_NAME}_linux.x86_64.zip

RUN godot -e --quit --display-driver headless
RUN echo 'export/web/web_sdk_path = "/usr/lib/web-sdk"' >> ~/.config/godot/editor_settings-4.tres
RUN echo 'export/web/debug_keystore = "/root/debug.keystore"' >> ~/.config/godot/editor_settings-4.tres
RUN echo 'export/web/debug_keystore_user = "webdebugkey"' >> ~/.config/godot/editor_settings-4.tres
RUN echo 'export/web/debug_keystore_pass = "web"' >> ~/.config/godot/editor_settings-4.tres
RUN echo 'export/web/force_system_user = false' >> ~/.config/godot/editor_settings-4.tres
RUN echo 'export/web/timestamping_authority_url = ""' >> ~/.config/godot/editor_settings-4.tres
RUN echo 'export/web/shutdown_adb_on_exit = true' >> ~/.config/godot/editor_settings-4.tres
