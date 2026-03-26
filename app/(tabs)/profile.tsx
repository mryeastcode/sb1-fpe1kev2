import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Bell, Shield, Circle as HelpCircle, Share2, Star, LogOut, ChevronRight, CreditCard as Edit, Camera, Target, Award } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  hasChevron?: boolean;
  hasSwitch?: boolean;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const profileStats = [
    { label: 'Current Weight', value: '156.2 lbs', icon: Target },
    { label: 'Goal Weight', value: '150.0 lbs', icon: Target },
    { label: 'Days Active', value: '127 days', icon: Award },
    { label: 'Calories Today', value: '1,250 cal', icon: Target },
  ];

  const menuSections: MenuSection[] = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', hasChevron: true },
        { icon: Target, label: 'Goals & Preferences', hasChevron: true },
        { icon: Bell, label: 'Notifications', hasSwitch: true, value: notifications, onToggle: setNotifications },
        { icon: Shield, label: 'Privacy & Security', hasChevron: true },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', hasChevron: true },
        { icon: Share2, label: 'Share App', hasChevron: true },
        { icon: Star, label: 'Rate FitTrack', hasChevron: true },
      ],
    },
    {
      title: 'Other',
      items: [
        { icon: Settings, label: 'App Settings', hasChevron: true },
        { icon: LogOut, label: 'Sign Out', hasChevron: false, isDestructive: true, onPress: handleSignOut },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User color="#ffffff" size={32} />
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera color="#10B981" size={16} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.user_metadata?.full_name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <stat.icon color="#10B981" size={20} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Premium Banner */}
        <LinearGradient
          colors={['#F59E0B', '#D97706']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.premiumBanner}>
          <View style={styles.premiumContent}>
            <View style={styles.premiumInfo}>
              <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
              <Text style={styles.premiumDescription}>
                Unlock advanced features and get personalized insights
              </Text>
            </View>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.menuItemLast
                  ]}
                  onPress={item.onPress}>
                  <View style={styles.menuItemLeft}>
                    <View style={[
                      styles.menuIcon,
                      item.isDestructive && styles.menuIconDestructive
                    ]}>
                      <item.icon 
                        color={item.isDestructive ? '#EF4444' : '#6B7280'} 
                        size={20} 
                      />
                    </View>
                    <Text style={[
                      styles.menuLabel,
                      item.isDestructive && styles.menuLabelDestructive
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  
                  <View style={styles.menuItemRight}>
                    {item.hasSwitch && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                        thumbColor="#ffffff"
                      />
                    )}
                    {item.hasChevron && (
                      <ChevronRight color="#9CA3AF" size={16} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>FitTrack v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for your health</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingTop: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userEmail: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  premiumBanner: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumInfo: {
    flex: 1,
    marginRight: 16,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  premiumDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 4,
  },
  premiumButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  premiumButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconDestructive: {
    backgroundColor: '#fef2f2',
  },
  menuLabel: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  menuLabelDestructive: {
    color: '#EF4444',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});