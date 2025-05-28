import { Tabs, TabsHeader, Tab } from "@material-tailwind/react";
import { LightBulbIcon, BookOpenIcon } from "@heroicons/react/24/solid";

export default function NavigationsTabs({ activeTab, setActiveTab }) {
  return (
    <div>
      <Tabs value={activeTab} className="mb-8">
        <TabsHeader>
          <Tab
            value="vision-mission"
            onClick={() => setActiveTab("vision-mission")}>
            <div className="flex items-center gap-2">
              <LightBulbIcon className="h-5 w-5" />
              Visi, Misi & Tujuan
            </div>
          </Tab>
          <Tab value="history" onClick={() => setActiveTab("history")}>
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-5 w-5" />
              Sejarah Sekolah
            </div>
          </Tab>
        </TabsHeader>
      </Tabs>
    </div>
  );
}
