export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          alt_text: string | null
          category_key: string
          count_text: string
          created_at: string
          description: string
          icon_name: string
          id: number
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          category_key: string
          count_text: string
          created_at?: string
          description: string
          icon_name: string
          id?: number
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          category_key?: string
          count_text?: string
          created_at?: string
          description?: string
          icon_name?: string
          id?: number
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      footer_settings: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          admin_link: string | null
          admin_text: string | null
          agreement_link: string | null
          agreement_text: string | null
          business_name: string | null
          created_at: string
          delivery_link: string | null
          delivery_text: string | null
          email: string | null
          id: number
          inn: string | null
          ogrnip: string | null
          payment_link: string | null
          payment_text: string | null
          phone: string | null
          policy_link: string | null
          policy_text: string | null
          updated_at: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          admin_link?: string | null
          admin_text?: string | null
          agreement_link?: string | null
          agreement_text?: string | null
          business_name?: string | null
          created_at?: string
          delivery_link?: string | null
          delivery_text?: string | null
          email?: string | null
          id?: number
          inn?: string | null
          ogrnip?: string | null
          payment_link?: string | null
          payment_text?: string | null
          phone?: string | null
          policy_link?: string | null
          policy_text?: string | null
          updated_at?: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          admin_link?: string | null
          admin_text?: string | null
          agreement_link?: string | null
          agreement_text?: string | null
          business_name?: string | null
          created_at?: string
          delivery_link?: string | null
          delivery_text?: string | null
          email?: string | null
          id?: number
          inn?: string | null
          ogrnip?: string | null
          payment_link?: string | null
          payment_text?: string | null
          phone?: string | null
          policy_link?: string | null
          policy_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hero_settings: {
        Row: {
          background_alt: string | null
          background_image_url: string | null
          button_text: string
          created_at: string
          id: number
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          background_alt?: string | null
          background_image_url?: string | null
          button_text?: string
          created_at?: string
          id?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Update: {
          background_alt?: string | null
          background_image_url?: string | null
          button_text?: string
          created_at?: string
          id?: number
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          compatible_with: number[] | null
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          light_color: string
          name: string
          power: string
          price: number
          updated_at: string
        }
        Insert: {
          category: string
          compatible_with?: number[] | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          light_color: string
          name: string
          power: string
          price: number
          updated_at?: string
        }
        Update: {
          category?: string
          compatible_with?: number[] | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          light_color?: string
          name?: string
          power?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      ready_sets: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          price: number
          product_ids: number[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
          price: number
          product_ids: number[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          price?: number
          product_ids?: number[]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
