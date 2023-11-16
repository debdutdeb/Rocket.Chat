// docker buildx bake [target] --set [target].platform=linux/amd64 --load

group "default" {targets = []}

target "base" {
	platforms = ["linux/amd64", "linux/arm64"]
	context = "."
	pull = true
}

target "rocketchat" {
	inherits = ["base"]
	dockerfile = "Dockerfile"
	context = "/tmp/build"
}

target "rocketchat-alpine" {
	inherits = ["rocketchat"]
	dockerfile = "Dockerfile.alpine"
}

target "authorization-service" {
	inherits = ["base"]
	dockerfile = "./ee/apps/authorization-service/Dockerfile"
	args = {
		SERVICE = "authorization-service"
	}
}

target "account-service" {
	inherits = ["base"]
	dockerfile = "./ee/apps/account-service/Dockerfile"
	args = {
		SERVICE = "account-service"
	}
}

target "presence-service" {
	inherits = ["base"]
	dockerfile = "./ee/apps/presence-service/Dockerfile"
	args = {
		SERVICE = "presence-service"
	}
}

target "ddp-streamer-service" {
	inherits = ["base"]
	dockerfile = "./ee/apps/ddp-streamer-service/Dockerfile"
	args = {
		SERVICE = "ddp-streamer"
	}
}

target "stream-hub-service" {
	inherits = ["base"]
	dockerfile = "./ee/apps/stream-hub-service/Dockerfile"
	args = {
		SERVICE = "stream-hub-service"
	}
}

target "queue-worker-service" {
	inherits = ["base"]
	dockerfile = "./ee/apps/queue-worker/Dockerfile"
	args = {
		SERVICE = "queue-worker"
	}
}

target "omnichannel-transcript-service" {
	inherits = ["base"]
	dockerfile = "./ee/apps/omnichannel-transcript/Dockerfile"
	args = {
		SERVICE = "omnichannel-transcript"
	}
}
