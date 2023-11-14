# Projeto-final-back-e-front-end
Aplicativo de venda e estoque 

# base-ionic5-cordova-angular-
projeto de base 

configurar device em mac
 -> seta permissao geral na anterior, e aplica a todos os arquivos
 -> pra assinar, conecta o iphone via usb
 -> setar a privacidade de uso da camera

 -> msm assim, se rodar no device fisico, e ainda der erro de assinatura, oq vc faz? fica marcando e desmarcando o "automaticically" ate funcionar!

configurar ambiente windows

-> instale o android studio
-> abre o android studio, sdk manager, sdk tools: instale a versao 30.0.3
-> instale o jdk-11.0.16_windows-x64_bin
-> copie a pasta gradle pra maquina (estou usando a versao gradle-4.10.2 e gradle-7.5.1
-> configure as variaveis de ambiente de acordo com o caminho da sua maquina, aqui vou deixar do meu msm como exemplo
ANDROID_HOME = C:\Users\user\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT = C:\Users\user\AppData\Local\Android\Sdk
GRADLE_HOME = C:\gradle-7.5.1
JAVA_HOME = C:\Program Files\Java\jdk-11.0.16

- em Path (variaveis de ambiente) adicione:
C:\Users\user\AppData\Local\Android\Sdk\platform-tools
C:\Users\user\AppData\Local\Android\Sdk\build-tools
C:\Users\user\AppData\Local\Android\Sdk\emulator
C:\gradle-4.10.2\bin

depois disso tudo e ainda der problema na hora de compilar pra android, ai é um problema (seu, #te vira)!

gerar apk 
-> Formar simples 

ionic cordova build android --release --prod;
"D:\Projeto\platforms\android\app\build\outputs\apk\debug\app-debug.apk
forma simples e eficar, o importante é funcionar mas não me pergunte como 

instalar a plataforma, plugins, resource e o node_modules no terminal dentro do projeto
$ ionic cordova platform 
$ ionic cordova platform add ios
$ ionic cordova platform add android
$ ionic cordova platform rm ios

 ionic cordova plugin 
$ ionic cordova plugin add cordova-plugin-inappbrowser@latest
$ ionic cordova plugin add phonegap-plugin-push --variable SENDER_ID=XXXXX
$ ionic cordova plugin rm cordova-plugin-camera

$ ionic cordova resources 
$ ionic cordova resources ios
$ ionic cordova resources android

npm i


