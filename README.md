# FSE-Trabalho-2

Trabalho 2 da disciplina de Fundamentos de Sistemas Embarcados (2021/2)

<p align="center">
  <img src="screenshot1.png" width="850" height="auto" alt="InGame Image"/>
</p>

## Objetivo

Este trabalho tem por objetivo a criação de um sistema distribuído de automação predial para monitoramento e acionamento de sensores e dispositivos de um prédio de 2 andares.

## Execução

### Para executar o projeto **localmente** execute os seguintes comandos:

#### 1. Abra um tunnel ssh

ssh -R 10049:localhost:10049 < rasp42 >

#### 1. Compile o servidor distribuido

```
make
```

#### 2. Execute

Para servidor do terreo:

```
make terreo_local
```

Para servidor 1oAndar:

```
make primeiro_local
```

---

### Para executar o projeto na rasp execute os seguintes comandos:

#### 1. Compile o servidor distribuido

```
cd distribuido
make
```

#### 2. Execute

Para servidor do terreo:

```
make terreo
```

Para servidor 1oAndar:

```
make primeiro
```

## Como usar

##

<p align="center">
  <img src="screenshot2.png" width="850" height="auto" alt="Image"/>
</p>

<p align="center">
  <img src="screenshot3.png" width="850" height="auto" alt="Image"/>
</p>
