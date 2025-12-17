# Block Bloom - iOS Build Instructions

## Prerequisites
- Mac with Xcode 15+ installed
- Apple Developer account ($99/year)
- CocoaPods (`sudo gem install cocoapods`)

## Step 1: Transfer Project to Mac

Copy the entire `block-game` folder to your Mac:
```bash
scp -r musa@116.203.78.184:/home/musa/projects/block-game ~/Desktop/
```

Or use git:
```bash
git clone https://github.com/musaceylan/block-game.git
cd block-game
```

## Step 2: Install Dependencies

```bash
cd block-game
npm install
```

## Step 3: Add iOS Platform

```bash
npx cap add ios
```

## Step 4: Copy iOS Assets

Copy icons to the iOS project:
```bash
# After iOS platform is added, copy icons
cp icons/ios/*.png ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

Copy splash screens:
```bash
cp splash/*.png ios/App/App/Assets.xcassets/Splash.imageset/
```

## Step 5: Sync & Open Xcode

```bash
npx cap sync ios
npx cap open ios
```

## Step 6: Configure in Xcode

1. **Select Team**:
   - Click on "App" in the project navigator
   - Select your Apple Developer Team under "Signing & Capabilities"

2. **Set Bundle Identifier**:
   - Should be `com.ceylan.blockbloom` (already set)

3. **Configure App Icons**:
   - Go to `Assets.xcassets` → `AppIcon`
   - Drag and drop icons from `icons/ios/` folder

4. **Configure Splash Screen**:
   - Go to `Assets.xcassets` → `Splash`
   - Add splash images

5. **Set Deployment Target**:
   - Set to iOS 14.0 or higher

6. **Update Display Name** (if needed):
   - In Info.plist, set `CFBundleDisplayName` to "Block Bloom"

## Step 7: Build & Test

1. Select a simulator or connected device
2. Press `Cmd + R` to build and run
3. Test all features:
   - [ ] Game loads correctly
   - [ ] Sound effects work
   - [ ] Haptic feedback works
   - [ ] All animations smooth
   - [ ] Score saves correctly

## Step 8: Archive for App Store

1. Select "Any iOS Device" as build target
2. Go to `Product` → `Archive`
3. Wait for archive to complete
4. Click "Distribute App"
5. Select "App Store Connect"
6. Follow the wizard to upload

## Step 9: App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app:
   - Platform: iOS
   - Name: Block Bloom
   - Bundle ID: com.ceylan.blockbloom
   - SKU: blockbloom001
   - Primary Language: English

3. Fill in App Information:
   - Category: Games → Puzzle
   - Age Rating: 4+
   - Price: Free (or your choice)

4. Add Screenshots (required sizes):
   - 6.5" (iPhone 14 Pro Max): 1290 x 2796
   - 5.5" (iPhone 8 Plus): 1242 x 2208
   - 12.9" iPad Pro: 2048 x 2732

5. Write Description:
```
Block Bloom - The ultimate block puzzle experience!

Features:
• Satisfying block-placing gameplay
• Beautiful animations and effects
• Premium sound design
• Combo system for high scores
• Daily puzzles
• Zen mode for relaxation
• Colorblind-friendly mode

Simple to learn, hard to master. Place blocks on the 10x10 grid and clear lines to score!
```

6. Add Keywords:
```
puzzle, block, tetris, brain, game, relax, strategy, logic
```

7. Submit for Review

## Troubleshooting

### Pod Install Fails
```bash
cd ios/App
pod install --repo-update
```

### Code Signing Issues
- Ensure your Apple Developer account is active
- Check that the Bundle ID matches your App ID in Apple Developer portal

### Build Errors
```bash
# Clean build folder
rm -rf ios/App/build
npx cap sync ios
```

### Haptics Not Working
- Haptics only work on physical devices, not simulators

## App Icon Sizes Reference

| Size | Usage |
|------|-------|
| 20x20 | Notification |
| 29x29 | Settings |
| 40x40 | Spotlight |
| 60x60 | iPhone App |
| 76x76 | iPad App |
| 83.5x83.5 | iPad Pro App |
| 1024x1024 | App Store |

All icons are in `icons/ios/` folder.

## Need Help?

- [Capacitor iOS Docs](https://capacitorjs.com/docs/ios)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
