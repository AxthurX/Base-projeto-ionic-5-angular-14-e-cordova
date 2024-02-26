# Projeto-final-back-e-front-end
Aplicativo de venda e estoque para um trabalho da faculdade

configurar device em mac
<br>
 -> seta permissao geral na anterior, e aplica a todos os arquivos <br>
 -> pra assinar, conecta o iphone via usb <br>
 -> setar a privacidade de uso da camera <br>
<br>

 -> msm assim, se rodar no device fisico, e ainda der erro de assinatura, oq vc faz? fica marcando e desmarcando o "automaticically" ate funcionar! <br>
<br>

configurar ambiente windows<br>
<br>
-> instale o android studio <br>
-> abre o android studio, sdk manager, sdk tools: instale a versao 30.0.3 <br>
-> instale o jdk-11.0.16_windows-x64_bin <br>
-> copie a pasta gradle pra maquina (estou usando a versao gradle-4.10.2 e gradle-7.5.1 <br>
-> configure as variaveis de ambiente de acordo com o caminho da sua maquina, aqui vou deixar do meu msm como exemplo <br>
ANDROID_HOME = C:\Users\user\AppData\Local\Android\Sdk <br>
ANDROID_SDK_ROOT = C:\Users\user\AppData\Local\Android\Sdk <br>
GRADLE_HOME = C:\gradle-7.5.1 <br>
JAVA_HOME = C:\Program Files\Java\jdk-11.0.16 <br>

- em Path (variaveis de ambiente) adicione: <br>
C:\Users\user\AppData\Local\Android\Sdk\platform-tools <br>
C:\Users\user\AppData\Local\Android\Sdk\build-tools <br>
C:\Users\user\AppData\Local\Android\Sdk\emulator <br>
C:\gradle-4.10.2\bin <br>
<br>
depois disso tudo e ainda der problema na hora de compilar pra android, ai é um problema fé em deus <br>
<br>
-> gerar apk de Formar simples e ligeira  <br>

ionic cordova build android --release --prod; <br>
"D:\Projeto\platforms\android\app\build\outputs\apk\debug\app-debug.apk <br>
forma simples e eficar, o importante é funcionar mas não me pergunte como  <br>

<br>
instalar a plataforma, plugins, resource e o node_modules no terminal dentro do projeto <br>

<br> 
baixe a plataforma que ira ultilizar
ionic cordova platform <br>
ionic cordova platform add ios <br>
ionic cordova platform add browser <br>
ionic cordova platform add android <br>
ionic cordova platform rm ios <br>

<br>
ionic cordova plugin <br>
ionic cordova plugin add nome do plugin <br> 
ionic cordova plugin add cordova-plugin-inappbrowser@latest <br>
ionic cordova plugin add phonegap-plugin-push --variable SENDER_ID=XXXXX <br>
ionic cordova plugin rm cordova-plugin-camera <br>
<br>

ionic cordova resources <br> 
ionic cordova resources ios <br>
ionic cordova resources android <br>

instalar pacotes NPM
npm i
npm i -f --legacy-peer-deps


