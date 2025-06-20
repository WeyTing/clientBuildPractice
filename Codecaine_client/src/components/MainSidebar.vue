<template>
	<div>
		<button
			@click="toggleSidebar"
			class="fixed top-4 flex items-center justify-center w-4 h-7 bg-[#5A5F73] text-amber-50 rounded-r cursor-pointer z-50 transition-all duration-400 hover:opacity-100 ease-in-out"
			:style="isSidebarOpen ? 'left: 160px;' : 'left: 0;'"
			:class="[
				isSidebarOpen
					? isSidebarHover
						? 'opacity-100'
						: 'opacity-0'
					: 'opacity-100',
			]"
		>
			<span :class="{ 'rotate-180': isSidebarOpen }">➤</span>
		</button>
		<header
			class="relative top-0 left-0 h-full transition-all duration-400 sidebar text-amber-50 z-50 ease-in-out w-[160px]"
			:class="isSidebarOpen ? 'translate-x-0' : ' -translate-x-[100%] '"
			@mouseenter="isSidebarHover = true"
			@mouseleave="isSidebarHover = false"
		>
			<div class="absolute top-4 -right-4 z-10 h-full">
				<div
					@click="toggleSidebar"
					class="inner-sidebar absolute w-3 right-[5px] -top-[15px] h-full opacity-25 -z-10 cursor-pointer bg-[repeating-linear-gradient(45deg,hsl(226.15deg,12.04%,57.65%),hsl(226.15deg,12.04%,57.65%)_2px,hsl(228deg,12.2%,40.2%)_0,hsl(228deg,12.2%,40.2%)_4px)] hover:opacity-50 hover:transition-opacity hover:duration-700 hover:ease-in-out text-zinc-950"
					:class="{ hidden: isSidebarOpen }"
				></div>
			</div>

			<div class="h-full overflow-y-auto overflow-x-hidden">
				<div>
					<div class="img { w-full h-12 px-3 relative justify-center }">
						<h1
							class="cursor-pointer bg-center bg-no-repeat w-full h-full"
							@click="goHome"
						></h1>
					</div>
				</div>
				<nav v-if="authStore.idToken">
					<div class="flex flex-col py-3 px-4 text-lg text-white">
						<h2
							class="cursor-pointer text-[9px] pb-3 relative create"
							@click="goYourwork"
						>
							CREATE
						</h2>
						<ul
							class="bg-[#2c303a] font-medium text-lg text-left mb-1 block w-full transition duration-200 ease-in-out cursor-pointer rounded-b-md"
						>
							<li class="cursor-pointer btn p-3 px-4" @click="goPen">
								✏️ Caine
							</li>
						</ul>
					</div>
					<div class="mt-1.5">
						<div
							class="text-xl p-3 px-4 cursor-pointer btn"
							@click="goYourwork"
						>
							Your Work
						</div>
					</div>
					<div class="mt-1.5">
						<div
							class="text-xl p-3 px-4 cursor-pointer btn"
							@click="goFollowing"
						>
							Following
						</div>
						<div
							class="text-xl p-3 px-4 cursor-pointer btn"
							@click="goTrending"
						>
							Trending
						</div>
					</div>
				</nav>
				<nav v-if="!authStore.idToken">
					<div class="flex flex-col py-3 px-4 text-white">
						<h2 class="text-[9px] pb-2">Try Our Online Editor</h2>
						<ul
							class="bg-[#2c303a] font-medium text-left mb-1 block w-full transition duration-200 ease-in-out cursor-pointer rounded-b-md"
						>
							<li
								class="cursor-pointer bg-black start text-center"
								@click="goPen"
							>
								<span class="bg-black block px-3 py-3">Start Coding</span>
							</li>
						</ul>
					</div>
					<div class="mt-1.5">
						<div class="text-xl p-3 px-4 cursor-pointer btn" @click="goSearch">
							Search Pains
						</div>
					</div>
					<div class="mt-1.5">
						<div class="text-xl p-3 px-4">組員姓名</div>
					</div>
				</nav>
				<button
					@click="callApi"
					class="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
				>
					呼叫後端 API
				</button>
				<li
					class="flex items-center px-4 py-2 hover:bg-red-600 text-red-400 cursor-pointer"
					@click="handleLogout"
				>
					<i class="fas fa-sign-out-alt mr-2 w-4 cur"></i>
					<span>Log Out</span>
				</li>
				<!--提醒自己測試用的btn-->
			</div>
		</header>
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const authStore = useAuthStore();
const router = useRouter();

const error = ref("");

const isSidebarHover = ref(false);

const goYourwork = () => {
	router.push("/your-work");
};
const goFollowing = () => {
	router.push("/following");
};
const goTrending = () => {
	router.push("/trending");
};
const goPen = () => {
	router.push("/pen");
};
const goHome = () => {
	router.push("/");
};
const goSearch = () => {
	router.push("/search");
};

const isSidebarOpen = ref(
	localStorage.getItem("sidebarOpen") === "false" ? false : true
);

const emit = defineEmits(["toggle"]);
function toggleSidebar() {
	isSidebarOpen.value = !isSidebarOpen.value;
	localStorage.setItem("sidebarOpen", isSidebarOpen.value); // 同步寫入 localStorage
	emit("toggle", isSidebarOpen.value);
}
//測試用

import api from "../config/api";
async function callApi() {
	if (!authStore.idToken) {
		error.value = "請先登入取得 token";
		console.log(error.value);
		return;
	}

	try {
		const res = await api.get("/api/auth/me");

		console.log("後端回應：", res.data);
	} catch (e) {
		error.value = `API 呼叫失敗：${e.response?.data?.error || e.message}`;
		console.error(e);
	}
}

const handleLogout = async () => {
	try {
		await signOut(auth); //  清除 Firebase 的登入狀態，避免下次開頁面自動觸發 onIdTokenChanged() 以為登入中
		authStore.clearToken(); //  清除 Pinia / localStorage 中的 token
		router.push("/");
	} catch {
		console.error("登出失敗：", e);
	}
};
</script>

<style scoped>
.sidebar {
	background-color: #1e1f26;
}

.btn:hover {
	background-color: #131417;
}

.inner-sidebar:hover {
	animation: fadeOut 0.5s ease-in-out infinite;
}

h1 {
	background-image: url(../assets/codepain.png);
	background-size: contain;
}

.create:hover {
	background: linear-gradient(
		90deg,
		#6495ed,
		#f2c464,
		#c51077,
		#34c759,
		#6495ed,
		#f2c464,
		#c51077,
		#34c759,
		#6495ed
	);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	animation: rainbow 4s linear infinite;
}

.create::after {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	content: "";
	height: 3px;
	border-radius: 5px 5px 0 0;
	z-index: 1;
	background-image: linear-gradient(
		90deg,
		#4567b7,
		#f7dc6f,
		#9c3f8f,
		#34c759,
		#4567b7,
		#f7dc6f,
		#9c3f8f,
		#34c759,
		#4567b7
	);
	background-size: 200% auto;
}
.create:hover::after {
	animation: rainbow 4s linear infinite;
}

.start {
	border: 2px solid transparent;
	border-top: 3px solid transparent;
	border-bottom: 3px solid transparent;
	border-radius: 6px;
	background: linear-gradient(
		115deg,
		#4fcf70,
		#fad648,
		#a767e5,
		#12bcfe,
		#44ce7b
	);
}
.start:hover {
	animation: rainbowLogout 2.5s linear infinite;
}

@keyframes fadeOut {
	0% {
		top: -15px;
	}
	100% {
		top: -30px;
	}
}

@keyframes rainbow {
	0% {
		background-position: 0 0;
	}
	100% {
		background-position: 200px 0;
	}
}

@keyframes rainbowLogout {
	0% {
		background-position: 0 0;
	}
	100% {
		background-position: -200px 0;
	}
}
</style>
