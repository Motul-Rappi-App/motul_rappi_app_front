# Usa una imagen base de Node.js para construir la aplicación
FROM node:20.17.0 AS build-env

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia todos los archivos necesarios para el build
COPY . ./

# Instala las dependencias
RUN npm install

# Compila la aplicación para producción
RUN npm run build

# Usa una imagen base de Nginx para servir la aplicación
FROM nginx:alpine

# Copia los archivos generados en la etapa anterior a la carpeta de Nginx
COPY --from=build-env /app/dist/promorappimotul/ /usr/share/nginx/html

# Copia la configuración personalizada de Nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
