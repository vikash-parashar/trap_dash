plugins { id("com.android.application") }

android {
    namespace = "com.vikash.trapdash"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.vikash.trapdash"
        minSdk = 24
        targetSdk = 35
        versionCode = (System.getenv("GITHUB_RUN_NUMBER") ?: "1").toInt()
        versionName = "0.1." + (System.getenv("GITHUB_RUN_NUMBER") ?: "0")
    }

    signingConfigs {
        // Test-only key with the standard public Android debug passwords, kept in the repo so every
        // test APK installs over the last one. The Play release will use the upload key from GitHub secrets.
        create("test") {
            storeFile = file("test.keystore")
            storePassword = "android"
            keyAlias = "androiddebugkey"
            keyPassword = "android"
        }
    }

    buildTypes {
        getByName("release") {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("test")
        }
        getByName("debug") { signingConfig = signingConfigs.getByName("test") }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.webkit:webkit:1.12.1")
}
